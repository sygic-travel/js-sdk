import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as rewire from 'rewire';
import * as sinon from 'sinon';
import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';

import { ApiResponse } from '../Xhr/ApiResponse';
import { filterToQueryString, getPlaces } from './PlacesController';
import PlacesFilter from './PlacesFilter';

chai.use(chaiAsPromised);

describe('Places', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	describe('filterToQueryString', () => {
		it('should build querystring from paramteres', (done) => {
			const placeFilter: PlacesFilter = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			const expectedQuerystring = '?categories=eating&parent=city:1&limit=20';
			const querystring = filterToQueryString(placeFilter);

			chai.expect(expectedQuerystring).to.equal(querystring);

			done();
		});
	});

	describe('getPlaces', () => {
		it('should throw and exception when response without places came', (done) => {
			sinon.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', {}));
			}));

			const placeFilter: PlacesFilter = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			chai.expect(getPlaces(placeFilter)).to.be.rejected;

			done();
		});
	});
});
