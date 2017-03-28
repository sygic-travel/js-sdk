import * as chai from 'chai';

import { PlacesFilter, PlacesFilterJSON } from './Filter';

describe('PlacesFilter', () => {
	describe('#filterToQueryString', () => {
		it('should build querystring from paramteres', (done) => {
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

			const placesFilter = new PlacesFilter(placesFilterJSON);
			const expectedQuerystring = '?categories=eating&parent=city:1&limit=20';

			chai.expect(expectedQuerystring).to.equal(placesFilter.toQueryString());

			done();
		});
	});

});
