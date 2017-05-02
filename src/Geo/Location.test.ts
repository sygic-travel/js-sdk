import * as chai from 'chai';
import { locationToCanvasCoordinate, locationToTileCoordinate, normalizeLng } from './Location';

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
});
