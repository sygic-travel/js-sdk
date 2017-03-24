import { filterToQueryString } from './Places';
import PlacesFilter from "./PlacesFilter";
import * as chai from 'chai';

describe('Places', () => {
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
