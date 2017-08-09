import * as chai from 'chai';

import { PlacesStatsFilter, PlacesStatsFilterJSON } from './StatsFilter';

describe('PlacesStatsFilter', () => {
	describe('#filterToQueryString', () => {
		it('should build querystring from paramteres wit map tile bounds', () => {
			const placesFilterJSON: PlacesStatsFilterJSON = {
				mapTileBounds: ['111,222'],
				query: 'some text'
			};

			const placesFilter = new PlacesStatsFilter(placesFilterJSON);
			const expectedQuerystring = 'query=some%20text&map_tile_bounds=111%2C222';

			chai.expect(placesFilter.toQueryString()).to.equal(expectedQuerystring);
		});
	});

	describe('#switchBoundsToMapTileBounds', () => {
		it('should return new object with map tile bounds', () => {
			const filter = new PlacesStatsFilter({
				zoom: 10,
				bounds: {
					south: 0,
					west: 0,
					north: 1,
					east: 1
				}
			});
			const modifiedFilter = filter.switchBoundsToMapTileBounds();
			chai.expect(modifiedFilter).to.has.property('_bounds', null);
			chai.expect(modifiedFilter).to.has.property('_mapTileBounds').deep.equal(['3000000000', '1222222212']);
			chai.expect(filter).to.has.property('_mapTileBounds').undefined;
		});
	});

	describe('#validate', () => {
		it('should raise error on missing zoom in filter', () => {
			const createFilter = () => {
				return  new PlacesStatsFilter({
					bounds: {
						south: 0,
						west: 0,
						north: 1,
						east: 1
					}
				});
			};
			chai.expect(createFilter).to.throw('Zoom must be specified when calling with bounds.');
		});
	});
});
