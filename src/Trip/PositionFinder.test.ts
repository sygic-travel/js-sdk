import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { Place } from '../Places';
import { placeDetailedEiffelTowerWithoutMedia as place } from '../TestData/PlacesExpectedResults';
import { itineratyItem as itineratyItemTemplate } from '../TestData/TripExpectedResults';
import { findOptimalPosition } from './PositionFinder';
import { ItineraryItem } from './Trip';

describe('PositionFinder', () => {
	describe('#findOptimalPosition', () => {
		it('should find ok position for empty day', () => {
			chai.expect(findOptimalPosition(place, [])).to.equal(0);
		});

		it('should add as second place when one place is present', () => {
			chai.expect(
				findOptimalPosition(buildTestPlace(0, 0, 'p:1'), [buildTestItem(0, 1, 'p:2', false)])
			).to.equal(1);
		});

		it('should add at correct place by air distance ', () => {
			const placeIn = buildTestPlace(0, 1, 'p:1');
			const places = [
				buildTestItem(0, 0, 'p:0', false),
				buildTestItem(0, 2, 'p:2', false),
				buildTestItem(0, 3, 'p:3', false),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(1);
		});

		it('should add at correct place by air distance and respect sticky at beginning', () => {
			const placeIn = buildTestPlace(0, 0, 'p:1');
			const places = [
				buildTestItem(0, 1, 'p:0', true),
				buildTestItem(0, 2, 'p:2', false),
				buildTestItem(0, 3, 'p:3', false),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(1);
		});

		it('should add at correct place by air distance and respect sticky at the and', () => {
			const placeIn = buildTestPlace(0, 4, 'p:1');
			const places = [
				buildTestItem(0, 1, 'p:0', false),
				buildTestItem(0, 2, 'p:2', false),
				buildTestItem(0, 3, 'p:3', true),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(2);
		});

		it('should add by default sticky place as last', () => {
			const placeIn = buildTestPlace(0, 0, 'p:2');
			placeIn.categories = ['sleeping'];
			const places = [
				buildTestItem(0, 1, 'p:0', false),
				buildTestItem(0, 3, 'p:1', false),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(2);
		});

		it('should add by default sticky place to order when other sticky is present', () => {
			const placeIn = buildTestPlace(0, 0, 'p:2');
			placeIn.categories = ['sleeping'];
			const places = [
				buildTestItem(0, 1, 'p:0', false),
				buildTestItem(0, 2, 'p:2', false),
				buildTestItem(0, 3, 'p:3', true),
			];
			chai.expect(findOptimalPosition(placeIn, places)).to.equal(0);
		});
	});
});

const buildTestItem = (lat: number, lng: number, id: string, isSticky: boolean): ItineraryItem => {
	const itineratyItem: ItineraryItem = cloneDeep(itineratyItemTemplate);
	const newPlace = buildTestPlace(lat, lng, id);
	itineratyItem.place = newPlace;
	itineratyItem.placeId = newPlace.id;
	itineratyItem.isSticky = isSticky;
	return itineratyItem;
};

const buildTestPlace = (lat: number, lng: number, id: string): Place => {
	const newPlace = cloneDeep(place);
	newPlace.location.lat = lat;
	newPlace.location.lng = lng;
	if (id) {
		newPlace.id = id;
	}
	return newPlace;
};
