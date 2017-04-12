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

	describe('#cloneSetBounds', () => {
		it('should return new object', () => {
			const filter = new PlacesFilter({
				zoom: 1
			});
			const bounds = {
				south: 0,
				west: 0,
				north: 1,
				east: 1
			};
			const modifiedFilter = filter.cloneSetBounds(bounds);
			chai.expect(modifiedFilter.bounds).to.be.deep.equal(bounds);
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter.bounds).to.be.undefined;
		});
	});

	describe('#cloneSetLimit', () => {
		it('should return new object', () => {
			const filter = new PlacesFilter({
				zoom: 1
			});
			const modifiedFilter = filter.cloneSetLimit(5);
			chai.expect(modifiedFilter).to.has.property('_limit', 5);
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter).to.has.property('_limit').undefined;
		});
	});

	describe('#cloneSetMapTile', () => {
		it('should return new object', () => {
			const filter = new PlacesFilter({
				zoom: 1
			});
			const modifiedFilter = filter.cloneSetMapTile('123');
			chai.expect(modifiedFilter).to.has.property('_mapTile', '123');
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter).to.has.property('_mapTile').undefined;
		});
	});

	describe('#validate', () => {
		it('should raise error on missing bounds in filter', () => {
			const createFilter = () => {
				return new PlacesFilter({
					mapSpread: 1,
					zoom: 5
				});
			};
			chai.expect(createFilter).to.throw('Bounds must be specified when calling with mapSpread.');
		});

		it('should raise error on missing zoom in filter', () => {
			const createFilter = () => {
				return new PlacesFilter({
					mapSpread: 1,
					bounds: {
						south: 0,
						west: 0,
						north: 1,
						east: 1
					}
				});
			};
			chai.expect(createFilter).to.throw('Zoom must be specified when calling with mapSpread.');
		});

		it('should raise error on limit zoom used with map spread', () => {
			const createFilter = () => {
				return new PlacesFilter({
					mapSpread: 1,
					limit: 5,
					bounds: {
						south: 0,
						west: 0,
						north: 1,
						east: 1
					}
				});
			};
			chai.expect(createFilter).to.throw('Do not use limit with mapSpread.');
		});
	});
});
