import * as chai from 'chai';
import { Location } from '.';
import {
	areBoundsInsideBounds,
	Bounds,
	createBoundsFromLocationAndSize,
	extendBounds,
	getGeoJsonAndBoundsIntersection,
	getZoomFromBounds
} from './Bounds';

describe('Bounds', () => {

	describe('#getZoomFromBounds', () => {
		it('should return correct zoom', () => {
			const bounds = {
				south: 51.45999681055091,
				west: -0.2542304992675782,
				north: 51.554661023239,
				east: -0.00102996826171
			};

			chai.expect(getZoomFromBounds(bounds, 1024)).to.equal(12);
			chai.expect(getZoomFromBounds(bounds, 512)).to.equal(11);
			chai.expect(getZoomFromBounds(bounds, 4100)).to.equal(14);
		});
	});

	describe('#areBoundsInsideBounds', () => {
		it('should return true when bounds1 are inside bounds2', () => {
			const bounds1: Bounds = {
				south: 49.90244371958209,
				west: 16.28304719924927,
				north: 53.57035171396274,
				east: 21.82015657424927
			};

			const bounds2: Bounds = {
				south: 49.79323713934528, west: 16.269618477546476, north: 53.38308981644604, east: 22.06545846526141
			};

			return chai.expect(areBoundsInsideBounds(bounds1, bounds2)).to.be.true;
		});

		it('should return false when bounds1 are bigger than bounds2', () => {
			const bounds1: Bounds = {
				south: 50,
				west: 1,
				north: 54,
				east: 4
			};

			const bounds2: Bounds = {
				south: 51,
				west: 2,
				north: 53,
				east: 3
			};

			return chai.expect(areBoundsInsideBounds(bounds1, bounds2)).to.be.false;
		});
	});

	describe('#createBoundsFromLocationAndSize', () => {
		it('should correctly create bounds', () => {
			const center: Location = { lng: 0, lat: 0 };
			const boundSideSize = 500000;
			return chai.expect(createBoundsFromLocationAndSize(center, boundSideSize, boundSideSize)).to.deep.eq({
				east: 4.500788596416625,
				north: 4.486966070158297,
				south: -4.486966070158297,
				west: -4.500788596416625
			});
		});
	});

	describe('#extendBounds', () => {
		it('should correctly extend bounds', () => {
			const bounds: Bounds = {
				south: 10,
				west: 10,
				north: 20,
				east: 20
			};
			const expandedBounds: Bounds = {
				east: 21.934864398722972,
				north: 21.78536722753607,
				south: 8.199308940027162,
				west: 8.18480833851933
			};

			return chai.expect(extendBounds(bounds, 200000)).to.deep.eq(expandedBounds);
		});
	});

	describe('#getGeoJsonAndBoundsIntersection', () => {
		it('should return true if geoJson and bounds intersect', () => {
			const geoJson: GeoJSON.DirectGeometryObject = {
				type: 'Polygon',
				coordinates: [[
					[5, 15],
					[15, 15],
					[25, 25],
					[5, 25],
					[5, 15]
				]]
			};

			const bounds: Bounds = {
				south: 10,
				west: 10,
				north: 20,
				east: 20
			};

			return chai.expect(getGeoJsonAndBoundsIntersection(geoJson, bounds)).to.be.true;
		});

		it('should return false if geoJson and bounds do not intersect', () => {
			const geoJson: GeoJSON.DirectGeometryObject = {
				type: 'Polygon',
				coordinates: [[
					[5, 15],
					[15, 15],
					[25, 25],
					[5, 25],
					[5, 15]
				]]
			};

			const bounds: Bounds = {
				south: 10,
				west: 40,
				north: 20,
				east: 50
			};

			return chai.expect(getGeoJsonAndBoundsIntersection(geoJson, bounds)).to.be.false;
		});
	});
});
