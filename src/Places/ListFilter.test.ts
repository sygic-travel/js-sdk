import * as chai from 'chai';

import { LogicalOperator } from './Filter';
import { PlacesListFilter, PlacesListFilterJSON } from './ListFilter';

describe('PlacesListFilter', () => {
	describe('#filterToQueryString', () => {
		it('should build querystring from paramteres', () => {
			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				query: '&ahoj=test?foo$bar',
				tags: []
			};

			const placesFilter = new PlacesListFilter(placesFilterJSON);
			const expectedQuerystring = 'query=%26ahoj%3Dtest%3Ffoo%24bar&categories=eating&parents=city%3A1&limit=20';

			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for categories', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating', 'doing sport'],
			};
			let placesFilter = new PlacesListFilter(placesFilterJSON);
			let expectedQuerystring = 'categories=eating%2Cdoing%20sport';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				categories: ['eating', 'doing sport'],
				categoriesOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'categories=eating%2Cdoing%20sport';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				categories: ['eating', 'doing sport'],
				categoriesOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'categories=eating%7Cdoing%20sport';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for tags', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				tags: ['restaurant', 'parking']
			};
			let placesFilter = new PlacesListFilter(placesFilterJSON);
			let expectedQuerystring = 'tags=restaurant%2Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				tags: ['restaurant', 'parking'],
				tagsOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'tags=restaurant%2Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				tags: ['restaurant', 'parking'],
				tagsOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'tags=restaurant%7Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for parents', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				parents: ['city:1', 'city:2']
			};
			let placesFilter = new PlacesListFilter(placesFilterJSON);
			let expectedQuerystring = 'parents=city%3A1%2Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				parents: ['city:1', 'city:2'],
				parentsOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'parents=city%3A1%2Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				parents: ['city:1', 'city:2'],
				parentsOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesListFilter(placesFilterJSON);
			expectedQuerystring = 'parents=city%3A1%7Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});
	});

	describe('#cloneSetBounds', () => {
		it('should return new object', () => {
			const filter = new PlacesListFilter({
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
			chai.expect(filter.bounds).to.be.null;
		});
	});

	describe('#cloneSetLimit', () => {
		it('should return new object', () => {
			const filter = new PlacesListFilter({
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
			const filter = new PlacesListFilter({
				zoom: 1
			});
			const modifiedFilter = filter.cloneSetMapTiles(['123']);
			chai.expect(modifiedFilter).to.has.property('_mapTiles').deep.equal(['123']);
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter).to.has.property('_mapTiles').undefined;
		});
	});

	describe('#validate', () => {
		it('should raise error on missing bounds in filter', () => {
			const createFilter = () => {
				return new PlacesListFilter({
					mapSpread: 1,
					zoom: 5
				});
			};
			chai.expect(createFilter).to.throw('Bounds must be specified when calling with mapSpread.');
		});

		it('should raise error on missing zoom in filter', () => {
			const createFilter = () => {
				return new PlacesListFilter({
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
				return new PlacesListFilter({
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
