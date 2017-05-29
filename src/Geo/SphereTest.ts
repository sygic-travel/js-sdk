import * as chai from 'chai';
import { Location } from '.';
import { EARTH_RADIUS, getDistance } from './Sphere';

describe('Sphere', () => {
	describe('#getDistance', () => {
		it('should return correct distance', () => {
			const point1: Location = {
				lat: 48.2,
				lng: 49.2
			};
			const point2: Location = {
				lat: 50.2,
				lng: 50.2
			};
			chai.expect(getDistance(point1, point2, EARTH_RADIUS)).to.be.equal(234214);
		});
	});
});
