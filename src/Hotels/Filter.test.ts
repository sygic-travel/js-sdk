import * as chai from 'chai';

import { HotelsFilter, HotelsFilterJSON } from '.';

describe('HotelsFilter', () => {
	describe('#filterToQueryString', () => {
		it('should build query string from basic paramateres', () => {
			const filterJSON: HotelsFilterJSON = {
				adults: 3,
				checkIn: '2017-11-11',
				checkOut: '2017-11-12',
				bounds: {
					south: 1,
					west: 2,
					north: 3,
					east: 4,
				}
			};

			const filter = new HotelsFilter(filterJSON);
			const expectedQuery = 'adults=3&bounds=1%2C2%2C3%2C4&check_in=2017-11-11&check_out=2017-11-12';

			chai.expect(filter.toQueryString()).to.equal(expectedQuery);
		});

		it('should build query string from all paramateres but not zoom', () => {
			const filterJSON: HotelsFilterJSON = {
				adults: 3,
				children: [1, 2],
				checkIn: '2017-11-11',
				checkOut: '2017-11-12',
				mapTileBounds: ['123123', '012012'],
				limit: 10,
				zoom: 5,
				maxPrice: 40,
				minPrice: 20,
				currency: 'CZK',
				stars: [1, 5],
				hotelFacilities: ['x', 'y'],
				roomFacilities: ['a', 'b'],
				propertyTypes: ['c', 'd'],
				minReviewScore: 10
			};

			const filter = new HotelsFilter(filterJSON);
			const expectedQuery = 'adults=3&check_in=2017-11-11&check_out=2017-11-12&children=1%2C2&currency=CZK' +
				'&hotel_facilities=x%2Cy&limit=10&map_tile_bounds=123123%2C012012&max_price=40&min_price=20&min_review_score=10' +
				'&property_types=c%7Cd&room_facilities=a%2Cb&stars=1%7C5';

			chai.expect(filter.toQueryString()).to.equal(expectedQuery);
		});
	});

	describe('#validate', () => {
		it('should raise error on missing adults', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 0,
					checkIn: '2017-11-11',
					checkOut: '2017-11-12',
				});
			};
			chai.expect(createFilter).to.throw('Adults count is mandatory.');
		});
		it('should raise error on missing bounds', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: '2017-11-11',
					checkOut: '2017-11-12',
				});
			};
			chai.expect(createFilter).to.throw(
				'Bounds, mapTileBounds and places have to be used exclusively and one of them has to be present.'
			);
		});
		it('should raise error when bounds passed with mapTileBounds', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: '2017-11-11',
					checkOut: '2017-11-12',
					bounds: {
						south: 1,
						west: 2,
						north: 3,
						east: 4,
					},
					mapTileBounds: ['1', '2']
				});
			};
			chai.expect(createFilter).to.throw(
				'Bounds, mapTileBounds and places have to be used exclusively and one of them has to be present.'
			);
		});
		it('should raise error when bounds passed with places', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: '2017-11-11',
					checkOut: '2017-11-12',
					bounds: {
						south: 1,
						west: 2,
						north: 3,
						east: 4,
					},
					placeIds: ['poi:1', 'poi:2']
				});
			};
			chai.expect(createFilter).to.throw(
				'Bounds, mapTileBounds and places have to be used exclusively and one of them has to be present.'
			);
		});
		it('should raise error when same dates are passed', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: '2017-11-11',
					checkOut: '2017-11-11',
					mapTileBounds: ['123', '321'],
				});
			};
			chai.expect(createFilter).to.throw('Invalid checkIn/checkOut combination.');
		});
		it('should raise error when some invalid dates are passed', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: 'xxx',
					checkOut: 'fdfdfd',
					mapTileBounds: ['123', '321'],
				});
			};
			chai.expect(createFilter).to.throw('Invalid checkIn date.');
		});
		it('should raise error when some invalid dates are passed', () => {
			const createFilter = () => {
				return new HotelsFilter({
					adults: 1,
					checkIn: '2017-11-11',
					checkOut: 'fdfdfd',
					placeIds: ['poi:1'],
				});
			};
			chai.expect(createFilter).to.throw('Invalid checkOut date.');
		});
	});
});
