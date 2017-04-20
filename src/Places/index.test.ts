import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import * as PlacesController from './index';

import * as TestData from '../TestData/PlacesApiResponses';

chai.use(chaiAsPromised);

let sandbox;

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
				resolve(new ApiResponse('200', 200, '', TestData.placeDetailedEiffelTowerWithoutMedia));
			}));

			const guid = 'region:1948650';
			const photoSize = '150x150';

			return chai.expect(PlacesController.getPlaceDetailed(guid, photoSize))
				.to.eventually.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', {}));
			}));

			const placesFilterJSON: PlacesFilterJSON = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesFilter(placesFilterJSON))).to.be.rejected;
		});

		it('should return array of places', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', TestData.places));
			}));

			const placesFilterJSON: PlacesFilterJSON = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesFilter(placesFilterJSON)))
				.to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', TestData.places));
			}));

			const placesFilterJSON: PlacesFilterJSON = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesFilter(placesFilterJSON)))
				.to.eventually.deep.equal(ExpectedResults.places);
		});
	});
});
