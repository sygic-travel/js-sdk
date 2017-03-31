import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import * as PlacesController from './index';

import * as TestData from '../TestData/Places';

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

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', (done) => {
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

			chai.expect(PlacesController.getPlaces(new PlacesFilter(placesFilterJSON))).to.be.rejected;

			done();
		});
	});

	describe('#getPlaceDetailed', () => {
		it('should correctly map to PlaceDetaled when response has no media', (done) => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', TestData.placeDetailedWithNoMediaResponse));
			}));

			const guid = 'region:1948650';
			const photoSize = '150x150';

			chai.expect(PlacesController.getPlaceDetailed(guid, photoSize)).to.eventually.have.property('media').to.be.empty;

			done();
		});
	});
});
