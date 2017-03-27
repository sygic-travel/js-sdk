import * as chai from 'chai';
import * as Xhr from '../Xhr';
import { ApiResponse } from "../Xhr/ApiResponse";
import { setEnvironment } from '../Settings';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';

import { filterToQueryString, getPlaces } from './Places';
import PlacesFilter from "./PlacesFilter";

chai.use(chaiAsPromised);

describe('Places', () => {
	before(done => {
		setEnvironment('api', '987654321');
		done();
	});

	describe('filterToQueryString', () => {
		it('should build querystring from paramteres', done => {
			const placeFilter: PlacesFilter = {
				query: null,
				mapTile: null,
				mapSpread: null,
				categories: ['eating'],
				tags: [],
				parent: 'city:1',
				level: null,
				limit: 20
			};

			const expectedQuerystring = '?categories=eating&parent=city:1&limit=20';
			const querystring = filterToQueryString(placeFilter);

			chai.expect(expectedQuerystring).to.equal(querystring);

			done();
		})
	});

	describe('getPlaces', () => {
		it('should throw and exception when response without places came', done => {
			sinon.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve)=>{
				resolve(new ApiResponse('200', 200, '', {}))
			}));

			const placeFilter: PlacesFilter = {
				query: null,
				mapTile: null,
				mapSpread: null,
				categories: ['eating'],
				tags: [],
				parent: 'city:1',
				level: null,
				limit: 20
			};

			chai.expect(getPlaces(placeFilter)).to.be.rejected;

			done();
		})
	})
});
