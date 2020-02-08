import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';

import { LogicalOperator } from './Filter';
import { PlacesListFilterJSON, PlacesQuery } from './ListFilter';
import { Category } from './Place';

chai.use(dirtyChai);

describe('PlacesQuery', () => {
	describe('#filterToQueryString', () => {
		it('should build querystring from paramteres', () => {
			const placesFilterJSON: PlacesListFilterJSON = {
				categories: [Category.EATING],
				limit: 20,
				parents: ['city:1'],
				query: '&ahoj=test?foo$bar',
				tags: [],
				preferredLocation: {
					lat: 10.5,
					lng: 20.4
				}
			};

			const placesFilter = new PlacesQuery(placesFilterJSON);
			const expectedQuerystring = 'query=%26ahoj%3Dtest%3Ffoo%24bar&categories=eating&' +
				'parents=city%3A1&limit=20&preferred_location=10.5%2C20.4';

			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for categories', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				categories: [Category.EATING, Category.SHOPPING],
			};
			let placesFilter = new PlacesQuery(placesFilterJSON);
			let expectedQuerystring = 'categories=eating%2Cshopping';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				categories: [Category.EATING, Category.SHOPPING],
				categoriesOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'categories=eating%2Cshopping';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				categories: [Category.EATING, Category.SHOPPING],
				categoriesOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'categories=eating%7Cshopping';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for tags', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				tags: ['restaurant', 'parking']
			};
			let placesFilter = new PlacesQuery(placesFilterJSON);
			let expectedQuerystring = 'tags=restaurant%2Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				tags: ['restaurant', 'parking'],
				tagsOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'tags=restaurant%2Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				tags: ['restaurant', 'parking'],
				tagsOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'tags=restaurant%7Cparking';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});

		it('should build query string respecting logical operators for parents', () => {
			let placesFilterJSON: PlacesListFilterJSON = {
				parents: ['city:1', 'city:2']
			};
			let placesFilter = new PlacesQuery(placesFilterJSON);
			let expectedQuerystring = 'parents=city%3A1%2Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				parents: ['city:1', 'city:2'],
				parentsOperator: LogicalOperator.AND
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'parents=city%3A1%2Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);

			placesFilterJSON = {
				parents: ['city:1', 'city:2'],
				parentsOperator: LogicalOperator.OR
			};
			placesFilter = new PlacesQuery(placesFilterJSON);
			expectedQuerystring = 'parents=city%3A1%7Ccity%3A2';
			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});
	});

	describe('#cloneSetBounds', () => {
		it('should return new object', () => {
			const filter = new PlacesQuery({
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
			chai.expect(filter.bounds).to.be.null('Expect null');
		});
	});

	describe('#cloneSetLimit', () => {
		it('should return new object', () => {
			const filter = new PlacesQuery({
				zoom: 1
			});
			const modifiedFilter = filter.cloneSetLimit(5);
			chai.expect(modifiedFilter).to.has.property('_limit', 5);
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter).to.has.property('_limit').undefined('Expect undefined');
		});
	});

	describe('#cloneSetMapTile', () => {
		it('should return new object', () => {
			const filter = new PlacesQuery({
				zoom: 1
			});
			const modifiedFilter = filter.cloneSetMapTiles(['123']);
			chai.expect(modifiedFilter).to.has.property('_mapTiles').deep.equal(['123']);
			chai.expect(modifiedFilter.zoom).to.be.equal(1);
			chai.expect(filter).to.has.property('_mapTiles').undefined('Expect undefined');
		});
	});

	describe('#validate', () => {
		it('should raise error on missing bounds in filter', () => {
			const createFilter = () => {
				return new PlacesQuery({
					mapSpread: 1,
					zoom: 5
				});
			};
			chai.expect(createFilter).to.throw('Bounds must be specified when calling with mapSpread.');
		});

		it('should raise error on missing zoom in filter', () => {
			const createFilter = () => {
				return new PlacesQuery({
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
				return new PlacesQuery({
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
