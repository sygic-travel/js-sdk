import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { Place } from '../Places';
import { placeDetailedEiffelTowerWithoutMedia as place } from '../TestData/PlacesExpectedResults';
import { itineratyItem as itineratyItemTemplate, tripDetailed } from '../TestData/TripExpectedResults';
import { UserSettings } from '../User';
import { AddToTripInstructions, findOptimalPositionInDay, getAddToTripInstructions } from './PositionFinder';
import { ItineraryItem, TransportMode, TransportSettings } from './Trip';

const tripTemplate = cloneDeep(tripDetailed);
tripTemplate.days = [];
const userSettings: UserSettings = {
	homePlaceId: 'poi:home',
	workPlaceId: 'poi:work'
};

describe('PositionFinder', () => {
	describe('#findOptimalPositionInDay', () => {
		it('should find ok position for empty day', () => {
			chai.expect(findOptimalPositionInDay(place, null, [])).to.equal(0);
		});

		it('should add as second place when one place is present', () => {
			chai.expect(
				findOptimalPositionInDay(buildPlace(0, 0, 'p:1'), null, [buildItem(0, 1, 'p:2', false)])
			).to.equal(1);
		});

		it('should add at correct place by air distance ', () => {
			const placeIn = buildPlace(0, 1, 'p:1');
			const places = [
				buildItem(0, 0, 'p:0', false),
				buildItem(0, 2, 'p:2', false),
				buildItem(0, 3, 'p:3', false),
			];
			chai.expect(findOptimalPositionInDay(placeIn, null, places)).to.equal(1);
		});

		it('should add at correct place by air distance and respect sticky at beginning', () => {
			const placeIn = buildPlace(0, 0, 'p:1');
			const stickyItineraryItem = buildItem(0, 1, 'p:5', true);
			const places = [
				buildItem(0, 1, 'p:0', true),
				buildItem(0, 2, 'p:2', false),
				buildItem(0, 3, 'p:3', false),
			];
			chai.expect(findOptimalPositionInDay(placeIn, stickyItineraryItem, places)).to.equal(1);
		});

		it('should add at correct place by air distance and respect sticky at the and', () => {
			const placeIn = buildPlace(0, 4, 'p:1');
			const places = [
				buildItem(0, 1, 'p:0', false),
				buildItem(0, 2, 'p:2', false),
				buildItem(0, 3, 'p:3', true),
			];
			chai.expect(findOptimalPositionInDay(placeIn, null, places)).to.equal(2);
		});

		it('should add by default sticky place as last', () => {
			const placeIn = buildPlace(0, 0, 'p:2');
			placeIn.categories = ['sleeping'];
			const places = [
				buildItem(0, 1, 'p:0', false),
				buildItem(0, 3, 'p:1', false),
			];
			chai.expect(findOptimalPositionInDay(placeIn, null, places)).to.equal(2);
		});

		it('should add by default sticky place to order when other sticky is present', () => {
			const placeIn = buildPlace(0, 0, 'p:2');
			placeIn.categories = ['sleeping'];
			const places = [
				buildItem(0, 1, 'p:0', false),
				buildItem(0, 2, 'p:2', false),
				buildItem(0, 3, 'p:3', true),
			];
			chai.expect(findOptimalPositionInDay(placeIn, null, places)).to.equal(0);
		});

		it('should respect sticky place from previous day', () => {
			const placeIn = buildPlace(0, 0, 'p:2');
			const stickyItineraryItem = buildItem(0, 1, 'p:5', true);
			const places = [
				buildItem(0, 1, 'p:0', true),
			];
			chai.expect(findOptimalPositionInDay(placeIn, stickyItineraryItem, places)).to.equal(1);
		});

		it('should respect sticky place from next day', () => {
			const placeIn = buildPlace(0, 0, 'p:2');
			const places = [
				buildItem(0, 1, 'p:0', true),
			];
			chai.expect(findOptimalPositionInDay(placeIn, null, places)).to.equal(0);
		});
	});

	describe('#getAddToTripInstructions', () => {
		it('should return correct result for empty trip day', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: []
			}];
			const result: AddToTripInstructions = {
				shouldDuplicate: false,
				position: 0
			};
			chai.expect(getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings)).to.deep.equal(result);
		});

		it('should return correct result day with one ordinary poi', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [buildItem(0, 0, 'poi:2', false, ['city:1'])]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false;
		});

		it('should return correct result day with two pois with unbreakable route', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			// First poi is closer
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', false, ['city:1']),
					buildItem(0, 1, 'poi:3', false, ['city:1'], 'plane')
				]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.false;
			// Second poi is closer
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', false, ['city:1']),
					buildItem(0, 0, 'poi:3', false, ['city:1'], 'plane')
				]
			}];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(2);
			chai.expect(result2.shouldDuplicate).to.be.false;
		});

		it('should return correct for one ordinary poi with route to previous', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 0, 'poi:2', false, ['city:1']),
					]
				},
				{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 0, 'poi:3', false, ['city:1'], 'plane'),
					]
				}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false;
		});

		it('should prefer place in same destination', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', false, ['city:2']),
					buildItem(0, 1, 'poi:3', false, ['city:2']),
					buildItem(0, 1, 'poi:4', false, ['city:1']),
					buildItem(0, 2, 'poi:5', false, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(2);
			chai.expect(result.shouldDuplicate).to.be.false;
		});

		it('should handle only home in first day', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:home', true, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true;

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:home', true, ['city:1']),
				]
			}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', true, ['city:1']),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.false;
		});

		it('should add before home in last day even when it is closer', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
					note: null,
					date: null,
					itinerary: []
				}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 4, 'poi:2', false, ['city:1']),
					buildItem(0, 2, 'poi:home', true, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false;
		});

		it('should add correctly by distance', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [ {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 4, 'poi:2', false, ['city:1']),
					buildItem(0, 2, 'poi:3', false, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(2);
			chai.expect(result.shouldDuplicate).to.be.false;
		});

		it('should split two way sticky place', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 2, 'poi:3', true, ['city:1']),
					]
				}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', true, ['city:1']),
				]
				}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', true, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, [], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true;
		});

		it('should do duplication of place for route with plane between 2 sticky places', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', true, ['city:1']),
					buildItem(0, 2, 'poi:3', true, ['city:1'], 'plane'),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true;

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:2', true, ['city:1']),
					buildItem(0, 1, 'poi:3', true, ['city:1'], 'plane'),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.true;
		});

		it('should not do duplication for route with car between 2 sticky places', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', true, ['city:1']),
					buildItem(0, 2, 'poi:3', true, ['city:1'], 'car'),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false;

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:2', true, ['city:1']),
					buildItem(0, 1, 'poi:3', true, ['city:1'], 'car'),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.false;
		});
	});
});

const buildItem = (
	lat: number,
	lng: number,
	id: string,
	isSticky: boolean,
	parents?: string[],
	transport?: TransportMode
): ItineraryItem => {
	const itineratyItem: ItineraryItem = cloneDeep(itineratyItemTemplate);
	const newPlace = buildPlace(lat, lng, id, parents);
	itineratyItem.place = newPlace;
	itineratyItem.placeId = newPlace.id;
	itineratyItem.isSticky = isSticky;
	if (transport) {
		itineratyItem.transportFromPrevious = {
			mode: transport,
			avoid: [],
			startTime: null,
			duration: null,
			note: null,
			waypoints: [],
			routeId: null
		} as TransportSettings;
	}
	return itineratyItem;
};

const buildPlace = (lat: number, lng: number, id: string, parents?: string[]): Place => {
	const newPlace = cloneDeep(place);
	newPlace.location.lat = lat;
	newPlace.location.lng = lng;
	if (id) {
		newPlace.id = id;
	}
	if (parents) {
		newPlace.parents = parents;
	}
	return newPlace;
};
