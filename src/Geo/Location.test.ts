import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';
import { calculateLocationsBounds, isLocationInBounds } from './Bounds';
import {
	Location, locationToCanvasCoordinate, locationToTileCoordinate,
	normalizeLng
} from './Location';

chai.use(dirtyChai);

describe('Location', () => {
	describe('#locationToTileCoordinate', () => {
		it('should return correct tile coordinates', () => {
			const tile = locationToTileCoordinate({lat: 52.482780, lng: 14.325199}, 6);
			chai.expect(tile.x).to.equal(34);
			chai.expect(tile.y).to.equal(21);
		});
	});

	describe('#locationToCanvasCoordinate', () => {
		it('should return correct canvas coordinates', () => {
			const bounds = {
				south: 51.45999681055091,
				west: -0.2542304992675782,
				north: 51.554661023239,
				east: -0.00102996826171
			};
			const canvas = {
				width: 1024,
				height: 768
			};
			let coordinate = locationToCanvasCoordinate({lat: 51.48, lng: -0.1}, bounds, canvas);
			chai.expect(coordinate.x).to.equal(624);
			chai.expect(coordinate.y).to.equal(606);
			coordinate = locationToCanvasCoordinate({lat: 55.48, lng: -0.1}, bounds, canvas);
			chai.expect(coordinate.x).to.equal(624);
			chai.expect(coordinate.y).to.equal(-31846);
		});
	});

	describe('#normalizeLng', () => {
		it('should return correct longitude', () => {
			chai.expect(normalizeLng(10)).to.equal(10);
			chai.expect(normalizeLng(360)).to.equal(0);
			chai.expect(normalizeLng(180)).to.equal(180);
			chai.expect(normalizeLng(181)).to.equal(-179);
			chai.expect(normalizeLng(179)).to.equal(179);
			chai.expect(normalizeLng(541)).to.equal(-179);
			chai.expect(normalizeLng(-181)).to.equal(179);
			chai.expect(normalizeLng(-541)).to.equal(179);
		});
	});

	describe('#isLocationInBounds', () => {
		it('should return true if location is in bounds', () => {
			chai.expect(isLocationInBounds({
				lat: 5,
				lng: 6,
			}, {
				south: 4,
				west: 4,
				north: 7,
				east: 7
			})).to.be.true('Expect true');
			chai.expect(isLocationInBounds({
				lat: 4,
				lng: 4,
			}, {
				south: 4,
				west: 4,
				north: 7,
				east: 7
			})).to.be.true('Expect true');
			chai.expect(isLocationInBounds({
				lat: 7,
				lng: 7,
			}, {
				south: 4,
				west: 4,
				north: 7,
				east: 7
			})).to.be.true('Expect true');
		});
		it('should return false if location is not in bounds', () => {
			chai.expect(isLocationInBounds({
				lat: 5,
				lng: 6,
			}, {
				south: 7,
				west: 7,
				north: 8,
				east: 8
			})).to.be.false('Expect true');
		});
	});

	describe('#calculateLocationsBounds', () => {
		it('should correctly calculate bounds of locations array', () => {
			const location1: Location = { lat: 1, lng: 1 };
			const location2: Location = { lat: 2, lng: 2 };
			const location3: Location = { lat: 3, lng: 3 };
			const location4: Location = { lat: 4, lng: 4 };

			chai.expect(calculateLocationsBounds([
				location1,
				location2,
				location3,
				location4
			])).to.deep.equal({
				south: 1,
				west: 1,
				north: 4,
				east: 4
			});
		});

		it('should correctly calculate bounds of a single location' , () => {
			const location1: Location = { lat: 1, lng: 1 };
			chai.expect(calculateLocationsBounds([location1])).to.not.deep.equal({
				south: 1,
				west: 1,
				north: 4,
				east: 4
			});
		});
	});
});
