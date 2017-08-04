import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { Trip } from '.';
import { Place } from '../Places';
import { placeDetailedEiffelTowerWithoutMedia as place } from '../TestData/PlacesExpectedResults';
import { itineratyItem as itineratyItemTemplate, tripDetailed } from '../TestData/TripExpectedResults';
import { hasDayStickyPlaceFromBothSides, ItineraryItem } from './Trip';

let trip: Trip;

describe('Trip', () => {
	describe('#hasDayStickyPlaceFromBothSides', () => {
		beforeEach(() => {
			trip = cloneDeep(tripDetailed);
			trip.days = trip.days && trip.days.map((day) => { day.itinerary = []; return day; });
		});

		it('should detect both sides sticky', () => {
			if (!trip.days || trip.days.length < 2) {
				throw new Error('Wrong test trip.');
			}
			const itinerary = [
				buildTestItem(0, 1, 'p:0', true),
			];
			trip.days[0].itinerary = itinerary;
			trip.days[1].itinerary = itinerary;
			trip.days[2].itinerary = itinerary;
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.true;
		});

		it('should not detect both sides sticky', () => {
			if (!trip.days || trip.days.length < 2) {
				throw new Error('Wrong test trip.');
			}
			const itinerary = [
				buildTestItem(0, 1, 'p:0', true),
			];

			trip.days[0].itinerary = [];
			trip.days[1].itinerary = itinerary;
			trip.days[2].itinerary = itinerary;
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;

			trip.days[0].itinerary = itinerary;
			trip.days[1].itinerary = itinerary;
			trip.days[2].itinerary = [];
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;

			trip.days[0].itinerary = itinerary;
			trip.days[1].itinerary = [];
			trip.days[2].itinerary = itinerary;
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;

			trip.days[0].itinerary = itinerary;
			trip.days[1].itinerary = itinerary;
			trip.days[2].itinerary = [buildTestItem(0, 1, 'p:1', false)];
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;

			trip.days[0].itinerary = [buildTestItem(0, 1, 'p:1', false)];
			trip.days[1].itinerary = itinerary;
			trip.days[2].itinerary = itinerary;
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;

			trip.days[0].itinerary = itinerary;
			trip.days[1].itinerary = [buildTestItem(0, 1, 'p:1', false)];
			trip.days[2].itinerary = itinerary;
			chai.expect(hasDayStickyPlaceFromBothSides(trip, 1)).to.be.false;
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
