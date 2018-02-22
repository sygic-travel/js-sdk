import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';
import { cloneDeep } from '../Util';

import { Place } from '../Places';
import { placeDetailedEiffelTowerWithoutMedia as place } from '../TestData/PlacesExpectedResults';
import { itineratyItem as itineratyItemTemplate, tripDetailed } from '../TestData/TripExpectedResults';
import { UserSettings } from '../Session';
import { AddToTripInstructions, getAddToTripInstructions } from './PositionFinder';
import { ItineraryItem, TransportMode, TransportSettings } from './Trip';

const tripTemplate = cloneDeep(tripDetailed);
tripTemplate.days = [];
const userSettings: UserSettings = {
	homePlaceId: 'poi:home',
	workPlaceId: 'poi:work'
};

chai.use(dirtyChai);

describe('PositionFinder', () => {
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
				itinerary: [buildItem(0, 0, 'poi:2', null, ['city:1'])]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should return correct result day with two pois with unbreakable route', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			// First poi is closer
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', null, ['city:1']),
					buildItem(0, 1, 'poi:3', null, ['city:1'], TransportMode.PLANE)
				]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
			// Second poi is closer
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', null, ['city:1']),
					buildItem(0, 0, 'poi:3', null, ['city:1'], TransportMode.PLANE)
				]
			}];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(2);
			chai.expect(result2.shouldDuplicate).to.be.false('Expect false');
		});

		it('should return correct for one ordinary poi with route to previous', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 0, 'poi:2', null, ['city:1']),
					]
				},
				{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 0, 'poi:3', null, ['city:1'], TransportMode.PLANE),
					]
				}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should prefer place in same destination', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', null, ['city:2']),
					buildItem(0, 1, 'poi:3', null, ['city:2']),
					buildItem(0, 1, 'poi:4', null, ['city:1']),
					buildItem(0, 2, 'poi:5', null, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(2);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should handle only home in first day', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:home', 'first', ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true('Expect false');

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:home', 'first', ['city:1']),
				]
			}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', 'last', ['city:1']),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.false('Expect false');
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
					buildItem(0, 4, 'poi:2', null, ['city:1']),
					buildItem(0, 2, 'poi:home', 'last', ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should add correctly by distance', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [ {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 4, 'poi:2', null, ['city:1']),
					buildItem(0, 2, 'poi:3', null, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(2);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should split two way sticky place', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
					note: null,
					date: null,
					itinerary: [
						buildItem(0, 2, 'poi:3', 'last', ['city:1']),
					]
				}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', 'both', ['city:1']),
				]
				}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', 'first', ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, [], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true('Expect true');
		});

		it('should not split sticky place which is sticky to previous day', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', 'last', ['city:1']),
				]
			}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:3', 'first', ['city:1']),
				]
			}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:4', null, ['city:1']),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, [], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should do duplication of place for route with plane between 2 sticky places', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', 'first', ['city:1']),
					buildItem(0, 2, 'poi:3', 'last', ['city:1'], TransportMode.PLANE),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(0);
			chai.expect(result.shouldDuplicate).to.be.true('Expect true');

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:2', 'first', ['city:1']),
					buildItem(0, 1, 'poi:3', 'last', ['city:1'], TransportMode.PLANE),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.true('Expect true');
		});

		it('should not do duplication for route with car between 2 sticky places', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 1, 'poi:2', 'first', ['city:1']),
					buildItem(0, 2, 'poi:3', 'last', ['city:1'], TransportMode.CAR),
				]
			}
			];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');

			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 2, 'poi:2', 'first', ['city:1']),
					buildItem(0, 1, 'poi:3', 'last', ['city:1'], TransportMode.CAR),
				]
			}
			];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(1);
			chai.expect(result2.shouldDuplicate).to.be.false('Expect false');
		});

		it('should correctly add hotel if there is no sticky place', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			placeIn.categories = ['sleeping'];
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', null, ['city:1']),
					buildItem(0, 1, 'poi:3', null, ['city:1']),
				]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(2);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should correctly add hotel if there is already hotel', () => {
			const placeIn = buildPlace(0, 0, 'poi:1');
			placeIn.categories = ['sleeping'];
			const trip = cloneDeep(tripTemplate);
			trip.days = [{
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', null, ['city:1']),
					buildItem(0, 1, 'poi:3', 'last', ['city:1']),
				]
			}];
			const result: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 0, ['city:1'], userSettings);
			chai.expect(result.position).to.equal(1);
			chai.expect(result.shouldDuplicate).to.be.false('Expect false');
		});

		it('should not duplicate only sticky place in last day which is not also first', () => {
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
					buildItem(0, 0, 'poi:2', 'first', ['city:1']),
				]
			}];
			const result1: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result1.position).to.equal(1);
			chai.expect(result1.shouldDuplicate).to.be.false('Expect false');

			trip.days = [{
				note: null,
				date: null,
				itinerary: []
			}, {
				note: null,
				date: null,
				itinerary: [
					buildItem(0, 0, 'poi:2', 'last', ['city:1']),
				]
			}];
			const result2: AddToTripInstructions = getAddToTripInstructions(placeIn, trip, 1, ['city:1'], userSettings);
			chai.expect(result2.position).to.equal(0);
			chai.expect(result2.shouldDuplicate).to.be.false('Expect false');
		});
	});
});

const buildItem = (
	lat: number,
	lng: number,
	id: string,
	sticky: string | null,
	parents?: string[],
	transport?: TransportMode
): ItineraryItem => {
	const itineratyItem: ItineraryItem = cloneDeep(itineratyItemTemplate);
	const newPlace = buildPlace(lat, lng, id, parents);
	itineratyItem.place = newPlace;
	itineratyItem.placeId = newPlace.id;
	itineratyItem.isSticky = !! sticky;
	itineratyItem.isStickyFirstInDay = !!(sticky && ['both', 'first'].includes(sticky));
	itineratyItem.isStickyLastInDay = !!(sticky && ['both', 'last'].includes(sticky));
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
