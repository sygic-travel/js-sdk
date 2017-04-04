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
				query: '&ahoj=test?foo$bar',
				tags: []
			};

			const placesFilter = new PlacesFilter(placesFilterJSON);
			const expectedQuerystring = 'query=%26ahoj%3Dtest%3Ffoo%24bar&categories=eating&parent=city%3A1&limit=20';

			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			done();
		});
	});

});
