import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { Place } from '../Places';
import { placeDetailedEiffelTowerWithoutMedia as place } from '../TestData/PlacesExpectedResults';
import { findOptimalPosition } from './PositionFinder';

describe('PositionFinder', () => {
	describe('#findOptimalPosition', () => {
		it('should find ok position for empty day', () => {
			chai.expect(findOptimalPosition(place, [])).to.equal(0);
		});

		it('should add as second place when one place is present', () => {
			chai.expect(findOptimalPosition(buildTestPlace(0, 0), [buildTestPlace(0, 1)])).to.equal(1);
		});

		it('should add at air distance ', () => {
			const placeIn = buildTestPlace(0, 1);
			const places = [
				buildTestPlace(0, 0),
				buildTestPlace(0, 2),
				buildTestPlace(0, 3),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(1);
		});
	});
});

const buildTestPlace = (lat: number, lng: number): Place => {
	const newPlace = cloneDeep(place);
	newPlace.location.lat = lat;
	newPlace.location.lng = lng;
	return newPlace;
};
