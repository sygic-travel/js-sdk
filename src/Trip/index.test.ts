import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';

import * as TripController from '.';
import { tripsDetailedCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as PlaceTestData from '../TestData/PlacesApiResponses';
import * as TripTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('TripController', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		tripsDetailedCache.reset();
	});

	afterEach(() => {
		sandbox.restore();
	});

	const responsePlace1 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace2 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace3 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	const responsePlace4 = cloneDeep(PlaceTestData.placeDetailedEiffelTowerWithoutMedia.place);
	responsePlace1.id = 'poi:1';
	responsePlace2.id = 'poi:2';
	responsePlace3.id = 'poi:3';
	responsePlace4.id = 'poi:4';

	const placesResponse: any = {
		places: [
			responsePlace1,
			responsePlace2,
			responsePlace3,
			responsePlace4
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
				'poi:1', 'poi:2', 'poi:2', 'poi:3', 'poi:4'
			]);
		});
	});

	describe('#updateTrip', () => {
		it('should update trip with three days', () => {
			tripsDetailedCache.set(TripTestData.tripDetail.trip.id, TripTestData.tripDetail.trip);
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, placesResponse));
			}));

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
	});
});
