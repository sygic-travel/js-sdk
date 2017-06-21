import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache, tripsDetailedCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as TripApiTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { Day, ItineraryItem, Trip } from './Trip';

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
		clock = sinon.useFakeTimers();
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
		it('should just recall api and return trips', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripApiTestData.tripsList));
			}));

			return chai.expect(Dao.getTrips('', ''))
				.to.eventually.deep.equal(TripExpectedResults.tripList);
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
				}, 50);
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
	});

	describe('#handleTripChangeNotification', () => {
		it('should get updated trip from api and set it in cache', async () => {
			const tripInCache = cloneDeep(trip1FromApi);
			const tripFromApi = cloneDeep(trip1FromApi);
			tripFromApi.name = 'x';
			tripsDetailedCache.set(tripInCache.id, tripInCache);

			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: tripFromApi }));
			}));

			await Dao.handleTripChangeNotification(tripInCache.id);
			const tripToBeUpdated = await tripsDetailedCache.get(tripInCache.id);
			chai.expect(tripToBeUpdated.name).to.equal(tripFromApi.name);
		});

		it('should not call api when trip is not in cache', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			await Dao.handleTripChangeNotification('unknownId');
			chai.expect(apiStub.callCount).to.equal(0);
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
});
