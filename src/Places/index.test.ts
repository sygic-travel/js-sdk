import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { PlacesListFilter, PlacesListFilterJSON } from '.';
import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as PlacesController from './index';

import * as TestData from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('PlacesController', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getPlaceDetailed', () => {
		it('should correctly map api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));

			const guid = 'region:1948650';
			const photoSize = '150x150';

			return chai.expect(PlacesController.getPlaceDetailed(guid, photoSize))
				.to.eventually.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#getPlacesDetailed', () => {
		it('should correctly map api response', () => {

			const place1 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
			const place2 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
			place1.id = 'poi:1';
			place2.id = 'poi:2';

			const expectedResult1 = Object.assign({}, ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedResult2 = Object.assign({}, ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			expectedResult1.id = 'poi:1';
			expectedResult2.id = 'poi:2';

			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [place1, place2]
				}));
			}));

			return chai.expect(PlacesController.getPlacesDetailed(['poi:1', 'poi:2'], '150x150'))
				.to.eventually.deep.equal([expectedResult1, expectedResult2]);
		});
	});

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON))).to.be.rejected;
		});

		it('should return array of places', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON)))
				.to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON)))
				.to.eventually.deep.equal(ExpectedResults.places);
		});
	});
});
