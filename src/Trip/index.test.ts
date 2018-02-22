import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import { cloneDeep } from '../Util';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import * as TripController from '.';
import { Day, ItineraryItem, Trip } from './Trip';

import { ApiResponse, StApi } from '../Api';
import { tripsDetailedCache } from '../Cache';
import * as PlaceController from '../Places';
import { setEnvironment } from '../Settings';
import * as PlaceTestData from '../TestData/PlacesApiResponses';
import * as PlaceExpectedResults from '../TestData/PlacesExpectedResults';
import * as TripTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as User from '../Session';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);
chai.use(dirtyChai);

let userSettingsStub: SinonStub;

describe('TripController', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
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
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24')).to.be.rejected('Should be rejected');
		});

		it('should return array of trips', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24')).to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));
			return chai.expect(TripController.getTrips('2017-04-23', '2017-04-24'))
				.to.eventually.deep.equal(TripExpectedResults.tripList);
		});
	});

	describe('#getTripDetailed', () => {
		it('should throw an exception when response without trip came', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			return chai.expect(TripController.getTripDetailed('1234567890')).to.be.rejected('Should be rejected');
		});

		it('should correctly map api response', () => {
			const stub = sandbox.stub(StApi, 'get');

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

	describe('#addPlaceToDay', () => {
		it('should correctly add hotel to last position in day', () => {
			const hotel: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			hotel.id = 'poi:123456';
			hotel.categories = ['sleeping'];

			const newPoi: PlaceController.Place = cloneDeep(hotel);
			newPoi.categories = [];
			newPoi.id = 'poi:999';

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days![1].itinerary[0].placeId = 'poi:999';
			inputTrip.days![1].itinerary[0].place = newPoi;

			const expectedTrip: Trip = cloneDeep(inputTrip);
			if (expectedTrip.days) {
				const itineraryItem: ItineraryItem = {
					place: hotel,
					placeId: hotel.id,
					startTime: null,
					duration: null,
					note: null,
					isSticky: false,
					isStickyFirstInDay: false,
					isStickyLastInDay: false,
					transportFromPrevious: null
				};

				expectedTrip.days[0].itinerary[1].isSticky = false;
				expectedTrip.days[0].itinerary[1].isStickyFirstInDay = false;
				expectedTrip.days[0].itinerary[1].isStickyLastInDay = false;
				expectedTrip.days[1].itinerary[0].isSticky = false;
				expectedTrip.days[1].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[0].isStickyLastInDay = false;
				expectedTrip.days[0].itinerary.push(cloneDeep(itineraryItem));
			}

			const getPlacesStub = sandbox.stub(PlaceController, 'getDetailedPlaces');
			getPlacesStub.withArgs(['poi:123456']).returns(
				new Promise<(PlaceController.Place | null)[]>((resolve) => { resolve([hotel]); })
			);

			getPlacesStub.returns(
				new Promise<(PlaceController.Place | null)[]>((resolve) => {
					const places: (PlaceController.Place | null)[] = [cloneDeep(hotel)];

					if (expectedTrip.days) {
						expectedTrip.days.forEach((days: Day) => {
							days.itinerary.forEach((itineraryItem: ItineraryItem) => {
								places.push(itineraryItem.place);
							});
						});
					}

					resolve(places);
			}));

			return chai.expect(TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:123456', 0, 2))
				.to.eventually.eql(expectedTrip);
		});

		it('should correctly duplicate the both side sticky place', async () => {

			const stickyPlace: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			stickyPlace.id = 'poi:1';

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (!inputTrip.days) {
				throw new Error('Wrong trip data.');
			}
			const stickyItineraryItem1: ItineraryItem = {
				place: stickyPlace,
				placeId: stickyPlace.id,
				startTime: null,
				duration: null,
				note: null,
				isSticky: true,
				isStickyFirstInDay: false,
				isStickyLastInDay: true,
				transportFromPrevious: null
			};

			const stickyItineraryItem2: ItineraryItem = cloneDeep(stickyItineraryItem1);
			stickyItineraryItem2.isStickyFirstInDay = true;
			stickyItineraryItem2.isStickyLastInDay = true;

			const stickyItineraryItem3: ItineraryItem = cloneDeep(stickyItineraryItem1);
			stickyItineraryItem2.isStickyFirstInDay = true;
			stickyItineraryItem3.isStickyLastInDay = false;

			// Place in second day is sticky from both sides
			inputTrip.days[0].itinerary = [cloneDeep(stickyItineraryItem1)];
			inputTrip.days[1].itinerary = [cloneDeep(stickyItineraryItem2)];
			inputTrip.days[2].itinerary = [cloneDeep(stickyItineraryItem3)];

			const getPlacesStub = sandbox.stub(PlaceController, 'getDetailedPlaces');
			getPlacesStub.returns(new Promise<PlaceController.Place[]>((resolve) => {resolve([]); }));

			// Place to add
			const placeToAdd: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			placeToAdd.id = 'poi:2';
			getPlacesStub.withArgs(['poi:2']).returns(
				new Promise<(PlaceController.Place | null)[]>((resolve) => { resolve([placeToAdd]); })
			);

			const resultTrip: Trip = await TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:2', 1);
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

			// Places stubs
			const getPlacesStub = sandbox.stub(PlaceController, 'getDetailedPlaces');
			getPlacesStub.returns(new Promise<PlaceController.Place[]>((resolve) => {resolve([]); }));
			const placeToAdd: PlaceController.Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			placeToAdd.id = 'poi:100';
			getPlacesStub.withArgs(['poi:100']).returns(
				new Promise<(PlaceController.Place | null)[]>((resolve) => { resolve([placeToAdd]); })
			);

			// Test home in first day
			userSettingsStub.resetBehavior();
			userSettingsStub.returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: 'poi:100', workPlaceId: null});
			}));

			let resultTrip: Trip = await TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:100', 0);
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

			resultTrip = await TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:100', 0);
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

			resultTrip = await TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:100', 2);
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

			resultTrip = await TripController.getTripEditor().smartAddPlaceToDay(inputTrip, 'poi:100', 2);
			chai.expect(resultTrip.days && resultTrip.days.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary.length).to.equal(3);
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[0].placeId).to.equal('poi:4');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[1].placeId).to.equal('poi:5');
			chai.expect(resultTrip.days && resultTrip.days[2].itinerary[2].placeId).to.equal('poi:100');
		});
	});
});
