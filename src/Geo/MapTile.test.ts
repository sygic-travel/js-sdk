import * as chai from 'chai';
import { boundsToMapTileKeys, locationToMapTileKey } from './MapTile';

describe('MapTile', () => {
	describe('#boundsToMapTileKeys', () => {
		it('should return correct mapTileKeys for London', () => {
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
			const mapTileKeys = boundsToMapTileKeys(bounds, 11);
			chai.expect(mapTileKeys).to.deep.equal(expectedResult);
		});
	});

	describe('#locationToMapTileKey', () => {
		it('should return correct mapTileKey', () => {
			const location = {
				lat: 51.38678061104849,
				lng: -0.2688217163085938
			};
			chai.expect(locationToMapTileKey(location, 10)).to.equal('0313131313');
		});
	});
});
