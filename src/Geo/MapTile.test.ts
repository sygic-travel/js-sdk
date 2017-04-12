import * as chai from 'chai';
import { boundsToMapTileKeys } from './MapTile';

describe('Quadkey', () => {
	describe('#boundsToMapTileKeys', () => {
		it('should return correct quadkeys for London', () => {
			const bounds = {
				south: 51.38678061104849,
				west: -0.2688217163085938,
				north: 51.62739503977813,
				east: 0.08171081542968751
			};
			const expectedResult = [
				'12020200222',
				'03131311333',
				'03131311332',
				'12020202000',
				'03131313111',
				'03131313110',
				'12020202002',
				'03131313113',
				'03131313112',
				'12020202020',
				'03131313131',
				'03131313130'
			];
			const quadkeys = boundsToMapTileKeys(bounds, 11);
			chai.expect(quadkeys).to.deep.equal(expectedResult);
		});
	});
});
