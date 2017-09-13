import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache, tripsDetailedCache } from '../Cache';
import { setEnvironment, setTripConflictHandler } from '../Settings';
import * as TripApiTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as User from '../User';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { Day, ItineraryItem, Trip, TripTemplate } from './Trip';

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;
chai.use(chaiAsPromised);

describe('TripDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(User, 'getUserSettings').returns(new Promise<User.UserSettings>((resolve) => {
			resolve({homePlaceId: null, workPlaceId: null});
		}));
		clock = sinon.useFakeTimers((new Date()).getTime());
		Cache.reset();
	});

	afterEach(() => {
		clock.restore();
		sandbox.restore();
	});

	const trip1FromApi = cloneDeep(TripApiTestData.tripDetail.trip);
	trip1FromApi.id = '111';
	const trip1Expected: Trip = cloneDeep(TripExpectedResults.tripDetailed);
	trip1Expected.id = '111';

	if (trip1Expected.days) {
		trip1Expected.days = trip1Expected.days.map((day: Day) => {
			const newDay: Day = cloneDeep(day);
			newDay.itinerary = newDay.itinerary.map((itineraryItem: ItineraryItem) => {
				const newItineraryItem: ItineraryItem = cloneDeep(itineraryItem);
				delete newItineraryItem.place;
				return newItineraryItem;
			});
			return newDay;
		});
	}

	describe('#getTrips', () => {
		it('should just recallapi, compose parameter from and to and return trips', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripApiTestData.tripsList));
			}));

			const result: Trip[] = await Dao.getTrips();
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'trips/list?');
			chai.expect(result).to.deep.equal(TripExpectedResults.tripList);

			await Dao.getTrips(null, null);
			sinon.assert.calledWith(apiStub, 'trips/list?');

			await Dao.getTrips(null, '2017-01-01');
			sinon.assert.calledWith(apiStub, 'trips/list?to=2017-01-01');

			await Dao.getTrips('2017-01-01', null);
			sinon.assert.calledWith(apiStub, 'trips/list?from=2017-01-01');

			await Dao.getTrips('2017-01-01', '2017-12-01');
			sinon.assert.calledWith(apiStub, 'trips/list?from=2017-01-01&to=2017-12-01');
		});
	});

	describe('#getTripsInTrash', () => {
		it('should just recall api and return trips which are deleted', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripApiTestData.tripsList));
			}));

			const result: Trip[] = await Dao.getTripsInTrash();
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'trips/trash');
			chai.expect(result).to.deep.equal(TripExpectedResults.tripList);
		});
	});

	describe('#getTripDetailed', () => {
		it('should get trip response from api if is not in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: trip1FromApi }));
			}));

			return Dao.getTripDetailed('111').then((result) => {
				sinon.assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(trip1Expected);
			});
		});

		it('should get trip response from cache if it is already in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			tripsDetailedCache.set('111', trip1FromApi);

			return Dao.getTripDetailed('111').then((result) => {
				sinon.assert.notCalled(stub);
				return chai.expect(result).to.deep.equal(trip1Expected);
			});

		});
	});

	describe('#updateTrip', () => {
		it('should put updated trip to cache', () => {
			Dao.updateTrip(TripExpectedResults.tripDetailed).then(() => {
				return chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
					.to.be.eventually.deep.equal(TripApiTestData.tripDetail.trip);
			});
		});

		it('should call put on api and save response to cache', (done) => {
			const apiResponseTrip = cloneDeep(TripApiTestData.tripDetail.trip);
			apiResponseTrip.name = 'API TRIP';
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: apiResponseTrip }));
			}));
			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
					.to.be.eventually.deep.equal(TripApiTestData.tripDetail.trip);
				clock.tick(3100);
				chai.expect(apiPut.callCount).to.be.equal(1);
				clock.restore();
				// Wait for the trip be stored to cache before making further assertions
				setTimeout(() => {
					chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
					.to.be.eventually.deep.equal(apiResponseTrip);
					done();
				}, 100);
			});
		});

		it('should call put on api with actual updated_at', () => {
			const testUpdatedAt = new Date();
			clock.tick(1000);
			const apiResponseTrip = cloneDeep(TripApiTestData.tripDetail.trip);
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: apiResponseTrip }));
			}));
			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				clock.tick(3100);
				const callDate = new Date(apiPut.getCall(0).args[1].updated_at);
				chai.expect(callDate > testUpdatedAt).to.be.true;
				testUpdatedAt.setSeconds(testUpdatedAt.getSeconds() + 1);
				chai.expect(callDate < testUpdatedAt).to.be.true;
			});
		});

		it('should call put on api after timeout', () => {
			const apiResponseTrip = cloneDeep(TripApiTestData.tripDetail.trip);
			apiResponseTrip.name = 'API TRIP';
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: apiResponseTrip }));
			}));
			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
					.to.be.eventually.deep.equal(TripApiTestData.tripDetail.trip);
				clock.tick(2000);
				chai.expect(apiPut.callCount).to.be.equal(0);
				clock.tick(1100);
				chai.expect(apiPut.callCount).to.be.equal(1);
			});
		});

		it('should should call api only once for consequent updates within timeout', () => {
			const apiResponseTrip = cloneDeep(TripApiTestData.tripDetail.trip);
			apiResponseTrip.name = 'API TRIP';
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: apiResponseTrip }));
			}));
			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
					.to.be.eventually.deep.equal(TripApiTestData.tripDetail.trip);
				clock.tick(2000);
				chai.expect(apiPut.callCount).to.be.equal(0);
				Dao.updateTrip(TripExpectedResults.tripDetailed).then(() => {
					clock.tick(2000);
					chai.expect(apiPut.callCount).to.be.equal(0);
					clock.tick(1010);
					chai.expect(apiPut.callCount).to.be.equal(1);
				});
			});
		});

		it('should should call conflict handler on ignored conflict and leave server response', (done) => {
			let handlerCalled = false;
			const handler = async (info, trip) => { handlerCalled = true; return 'server'; };
			setTripConflictHandler(handler);
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					trip: TripApiTestData.tripDetail.trip,
					conflict_resolution: 'ignored',
					conflict_info: {
						last_user_name: 'Lojza',
						last_updated_at: '2017-10-10T10:10:10+02:00'
					}
				}));
			}));

			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				clock.tick(3010);
				clock.restore();
				// Wait for the trip be stored to cache before making further assertions
				setTimeout(() => {
					chai.expect(handlerCalled).to.be.true;
					chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
						.to.be.eventually.deep.equal(TripApiTestData.tripDetail.trip);
					chai.expect(apiPut.callCount).to.be.equal(1);
					done();
				}, 100);
			});
		});

		it('should should call update with newer updated_at when user select local changes', (done) => {
			let handlerCalled = false;
			const handler = async (info, trip) => { handlerCalled = true; return 'local'; };
			setTripConflictHandler(handler);
			const apiPut: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					trip: TripApiTestData.tripDetail.trip,
					conflict_resolution: 'ignored',
					conflict_info: {
						last_user_name: 'Lojza',
						last_updated_at: '2017-10-10T10:10:10+02:00'
					}
				}));
			}));

			Dao.updateTrip(TripExpectedResults.tripDetailed).then(async () => {
				clock.tick(3010);
				clock.restore();
				// Wait for the trip response to be handled before making further assertions
				setTimeout(() => {
					chai.expect(handlerCalled).to.be.true;
					chai.expect(apiPut.callCount).to.be.equal(2);
					done();
				}, 100);
			});
		});
	});

	describe('#shouldNotifyOnTripUpdate', () => {
		it('should get updated trip from api and set it in cache and return true', async () => {
			const tripInCache = cloneDeep(trip1FromApi);
			const tripFromApi = cloneDeep(trip1FromApi);
			tripFromApi.name = 'x';
			tripsDetailedCache.set(tripInCache.id, tripInCache);

			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: tripFromApi }));
			}));

			const result = await Dao.shouldNotifyOnTripUpdate(tripInCache.id, 34);
			const tripToBeUpdated = await tripsDetailedCache.get(tripInCache.id);
			chai.expect(tripToBeUpdated.name).to.equal(tripFromApi.name);
			chai.expect(result).to.be.true;
		});

		it('should not call api for trip which is already up to date and return should return false', async () => {
			const tripInCache = cloneDeep(trip1FromApi);
			await tripsDetailedCache.set(tripInCache.id, tripInCache);
			const apiStub = sandbox.stub(Xhr, 'get');

			const result = await Dao.shouldNotifyOnTripUpdate(tripInCache.id, 33);
			chai.expect(apiStub.callCount).to.equal(0);
			chai.expect(result).to.be.false;
		});

		it('should not call api when trip is not in cache and should return true', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			const result = await Dao.shouldNotifyOnTripUpdate('unknownId', null);
			chai.expect(apiStub.callCount).to.equal(0);
			chai.expect(result).to.be.true;
		});
	});

	describe('#deleteTripFromCache', () => {
		it('should delete trip from cache', async () => {
			const tripInCache = cloneDeep(trip1FromApi);
			await tripsDetailedCache.set(tripInCache.id, tripInCache);
			chai.expect(tripsDetailedCache.get(tripInCache.id)).to.eventually.deep.equal(tripInCache);
			await Dao.deleteTripFromCache(tripInCache.id);
			chai.expect(tripsDetailedCache.get(tripInCache.id)).to.eventually.equal(null);
		});
	});

	describe('#emptyTripsTrash', () => {
		it('should empty trips trash', () => {
			sandbox.stub(Xhr, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					deleted_trip_ids: ['poi:1', 'poi:2', 'poi:3']
				}));
			}));
			chai.expect(Dao.emptyTripsTrash()).to.eventually.deep.equal(['poi:1', 'poi:2', 'poi:3']);
		});
	});

	describe('#getTripTemplates', () => {
		it('should get trip templates', async () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					trip_templates: [{
						id: 1234,
						description: 'test',
						duration: 123456,
						trip: trip1FromApi
					}]
				}));
			}));

			const tripTemplate: TripTemplate[] = await Dao.getTripTemplates('city:1');
			chai.expect(tripTemplate[0]).to.deep.equal({
				id: 1234,
				description: 'test',
				duration: 123456,
				trip: trip1Expected
			});
		});
	});

	describe('#applyTripTemplate', () => {
		it('should apply a trip template (recall api) and return trip', async () => {
			sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					trip: cloneDeep(trip1FromApi)
				}));
			}));

			const expectedTrip: Trip = cloneDeep(trip1Expected);
			const resultTrip: Trip = await Dao.applyTripTemplate('111', 123, 1);
			const tripFromCache: any = await tripsDetailedCache.get('111');

			chai.expect(tripFromCache).to.deep.equal(cloneDeep(trip1FromApi));
			chai.expect(resultTrip).to.deep.equal(expectedTrip);
		});
	});
});
