import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import * as sinon from 'sinon';
import { SinonSandbox, SinonSpy, SinonStub } from 'sinon';

import * as TripController from '.';
import * as TripDao from './DataAccess';
import * as Mapper from './Mapper';
import { Day, ItineraryItem, Trip } from './Trip';

import { tripsDetailedCache } from '../Cache';
import * as PlaceController from '../Places';
import { setEnvironment } from '../Settings';
import * as PlaceTestData from '../TestData/PlacesApiResponses';
import * as PlaceExpectedResults from '../TestData/PlacesExpectedResults';
import * as TripTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as User from '../User';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

let userSettingsStub: SinonStub;

describe('TripController', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		userSettingsStub = sandbox.stub(User, 'getUserSettings').returns(new Promise<User.UserSettings>((resolve) => {
			resolve({homePlaceId: null, workPlaceId: null});
		}));
		tripsDetailedCache.reset();
	});

	afterEach(() => {
		sandbox.restore();
	});

	const responsePlace1 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace2 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace3 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace4 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace5 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	responsePlace1.id = 'poi:1';
	responsePlace2.id = 'poi:2';
	responsePlace3.id = 'poi:3';
	responsePlace4.id = 'poi:4';
	responsePlace5.id = 'poi:5';

	const placesResponse: any = {
		places: [
			responsePlace1,
			responsePlace2,
			responsePlace3,
			responsePlace4,
			responsePlace5
		]
	};

	describe('#getTrips', () => {
		it('should throw an exception when response without trips came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24')).to.be.rejected;
		});

		it('should return array of trips', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24')).to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24'))
				.to.eventually.deep.equal(TripExpectedResults.tripList);
		});
	});

	describe('#getTripDetailed', () => {
		it('should throw an exception when response without trip came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			return chai.expect(TripController.getTripDetailed('1234567890')).to.be.rejected;
		});

		it('should correctly map api response', () => {
			const stub = sandbox.stub(Xhr, 'get');

			stub.onFirstCall().returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripDetail));
			}));

			stub.onSecondCall().returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, placesResponse));
			}));

			return chai.expect(TripController.getTripDetailed('1234567890'))
				.to.eventually.deep.equal(cloneDeep(TripExpectedResults.tripDetailed));
		});
	});

	describe('#getPlacesGuidsFromTrip', () => {
		it('should get places guids from mapped trip', () => {
			return chai.expect(TripController.getPlacesIdsFromTrip(TripExpectedResults.tripDetailed)).to.deep.equal([
				'poi:1', 'poi:2', 'poi:2', 'poi:3', 'poi:4', 'poi:5'
			]);
		});
	});

	describe('#updateTrip', () => {
		it('should update trip with three days', () => {
			tripsDetailedCache.set(TripTestData.tripDetail.trip.id, TripTestData.tripDetail.trip);
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, placesResponse));
			}));
			sandbox.stub(TripDao, 'updateTrip').returnsArg(0);

			const expectedTrip: TripController.Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.name = 'abc';
			expectedTrip.startsOn = '2017-04-10';
			expectedTrip.endsOn = '2017-04-12';
			expectedTrip.privacyLevel = 'ppp';

			return chai.expect(TripController.updateTrip('58c6bce821287', {
				name: 'abc',
				startsOn: '2017-04-10',
				privacyLevel: 'ppp'
			} as TripController.TripUpdateData)).to.eventually.deep.equal(expectedTrip);
		});

		it('should call dao correctly when deleting a trip', async () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days = null;

			sandbox.stub(TripDao, 'getTripDetailed').returns(new Promise<Trip>((resolve) => {resolve(inputTrip); }));
			const spy: SinonSpy = sandbox.spy(TripDao, 'updateTrip');

			await TripController.updateTrip('123', { isDeleted: true });
			const tripToBeUpdated: Trip = spy.getCall(0).args[0] as Trip;
			return chai.expect(tripToBeUpdated.isDeleted).to.be.true;
		});

		it('should call dao correctly when restoring a trip', async () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days = null;
			inputTrip.isDeleted = true;

			sandbox.stub(TripDao, 'getTripDetailed').returns(new Promise<Trip>((resolve) => {resolve(inputTrip); }));
			const spy: SinonSpy = sandbox.spy(TripDao, 'updateTrip');

			await TripController.updateTrip('123', { isDeleted: false });
			const tripToBeUpdated: Trip = spy.getCall(0).args[0] as Trip;
			return chai.expect(tripToBeUpdated.isDeleted).to.be.false;
		});
	});

	describe('#addPlaceToDay', () => {
		it('should correctly add hotel to last position in day', () => {
			const hotel: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			hotel.id = 'poi:123456';
			hotel.categories = ['sleeping'];

			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (expectedTrip.days) {
				const itineraryItem: ItineraryItem = {
					place: hotel,
					placeId: hotel.id,
					startTime: null,
					duration: null,
					note: null,
					isSticky: false,
					transportFromPrevious: null
				};

				expectedTrip.days[0].itinerary[1].isSticky = false;
				expectedTrip.days[1].itinerary[0].isSticky = false;

				const newPoi: PlaceController.Place = cloneDeep(hotel);
				newPoi.categories = [];
				newPoi.id = 'poi:999';
				expectedTrip.days[1].itinerary[0].place = newPoi;
				expectedTrip.days[1].itinerary[0].placeId = 'poi:999';

				expectedTrip.days[0].itinerary.push(cloneDeep(itineraryItem));
			}

			sandbox.stub(Xhr, 'get').onFirstCall().returns(new Promise<ApiResponse>((resolve) => {
				const trip = cloneDeep(TripTestData.tripDetail.trip);
				trip.days[1].itinerary[0].place_id = 'poi:999';
				resolve(new ApiResponse(200, { trip }));
			}));

			sandbox.stub(TripDao, 'updateTrip').returnsArg(0);

			sandbox.stub(PlaceController, 'getPlaceDetailed').returns(new Promise<PlaceController.Place>((resolve) => {
				resolve(cloneDeep(hotel));
			}));
			sandbox.stub(PlaceController, 'getPlacesDetailed').returns(
				new Promise<(PlaceController.Place | null)[]>((resolve) => {
					const places: (PlaceController.Place | null)[] = [];

					if (expectedTrip.days) {
						expectedTrip.days.forEach((days: Day) => {
							days.itinerary.forEach((itineraryItem: ItineraryItem) => {
								places.push(itineraryItem.place);
							});
						});
					}

					resolve(places);
			}));

			return chai.expect(TripController.addPlaceToDay('1234', 'poi:123456', 0, 2))
				.to.eventually.eql(expectedTrip);
		});

		it('should correctly duplicate the both side sticky place', async () => {

			const stickyPlace: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			stickyPlace.id = 'poi:1';

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (!inputTrip.days) {
				throw new Error('Wrong trip data.');
			}
			const stickyItineraryItem: ItineraryItem = {
				place: stickyPlace,
				placeId: stickyPlace.id,
				startTime: null,
				duration: null,
				note: null,
				isSticky: true,
				transportFromPrevious: null
			};
			// Place in second day is sticky from both sides
			inputTrip.days[0].itinerary = [cloneDeep(stickyItineraryItem)];
			inputTrip.days[1].itinerary = [cloneDeep(stickyItineraryItem)];
			inputTrip.days[2].itinerary = [cloneDeep(stickyItineraryItem)];

			// Stubs for fetching trip
			sandbox.stub(TripDao, 'getTripDetailed').returns(new Promise<Trip>((resolve) => {resolve(inputTrip); }));
			sandbox.stub(Mapper, 'putPlacesToTrip').returns(new Promise<Trip>((resolve) => {resolve(inputTrip); }));
			sandbox.stub(PlaceController, 'getPlacesDetailed');

			// Update trip stub
			sandbox.stub(TripDao, 'updateTrip').callsFake((trip) => {
				return new Promise<Trip>((resolve) => {
					resolve(trip);
				});
			});

			// Place to add
			const placeToAdd: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			placeToAdd.id = 'poi:2';
			sandbox.stub(PlaceController, 'getPlaceDetailed').returns(new Promise<PlaceController.Place>((resolve) => {
				resolve(placeToAdd);
			}));

			const resultTrip: Trip = await TripController.addPlaceToDay('xxx', 'poi:2', 1);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary.length).to.equal(1);
			chai.expect(resultTrip.days && resultTrip.days[1].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[1].itinerary[0].placeId).to.equal('poi:1');
			chai.expect(resultTrip.days && resultTrip.days[1].itinerary[1].placeId).to.equal('poi:2');
			chai.expect(resultTrip.days && resultTrip.days[1].itinerary[2].placeId).to.equal('poi:1');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary.length).to.equal(1);
		});

		it('should add home/work at the beginning of the first day and end of last day', async () => {

			const place: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place.id = 'poi:1';

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (!inputTrip.days) {
				throw new Error('Wrong trip data.');
			}

			// Stubs for fetching trip
			sandbox.stub(TripDao, 'getTripDetailed').returns(new Promise<Trip>((resolve) => { resolve(inputTrip); }));
			sandbox.stub(Mapper, 'putPlacesToTrip').returns(new Promise<Trip>((resolve) => { resolve(inputTrip); }));
			sandbox.stub(PlaceController, 'getPlacesDetailed');

			// Update trip stub
			sandbox.stub(TripDao, 'updateTrip').callsFake((trip) => {
				return new Promise<Trip>((resolve) => {
					resolve(trip);
				});
			});

			// Place to add
			const placeToAdd: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			placeToAdd.id = 'poi:100';
			sandbox.stub(PlaceController, 'getPlaceDetailed').returns(new Promise<PlaceController.Place>((resolve) => {
				resolve(placeToAdd);
			}));

			// Test home in first day
			userSettingsStub.resetBehavior();
			userSettingsStub.returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: 'poi:100', workPlaceId: null});
			}));

			let resultTrip: Trip = await TripController.addPlaceToDay('xxx', 'poi:100', 0);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[0].placeId).to.equal('poi:100');
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[1].placeId).to.equal('poi:1');
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[2].placeId).to.equal('poi:2');

			// Test work in first day
			userSettingsStub.resetBehavior();
			userSettingsStub.returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: null, workPlaceId: 'poi:100'});
			}));

			resultTrip = await TripController.addPlaceToDay('xxx', 'poi:100', 0);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[0].placeId).to.equal('poi:100');
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[1].placeId).to.equal('poi:1');
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[2].placeId).to.equal('poi:2');

			// Test home in last day
			userSettingsStub.resetBehavior();
			userSettingsStub.returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: 'poi:100', workPlaceId: null});
			}));

			resultTrip = await TripController.addPlaceToDay('xxx', 'poi:100', 2);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[0].placeId).to.equal('poi:4');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[1].placeId).to.equal('poi:5');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[2].placeId).to.equal('poi:100');

			// Test work in last day
			userSettingsStub.resetBehavior();
			userSettingsStub.returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: null, workPlaceId: 'poi:100'});
			}));

			resultTrip = await TripController.addPlaceToDay('xxx', 'poi:100', 2);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[0].placeId).to.equal('poi:4');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[1].placeId).to.equal('poi:5');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[2].placeId).to.equal('poi:100');
		});
	});
});
