import * as cloneDeep from 'lodash.clonedeep';

import { Day, Trip } from '.';
import { isStickyByDefault, Place } from '../Places';
import { addDaysToDate, subtractDaysFromDate } from '../Util';
import { resolveStickiness } from './Mapper';
import { ItineraryItem, TransportSettings } from './Trip';
import { decorateDaysWithDate } from './Utility';

// Day methods
export function addDay(tripToBeUpdated: Trip): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.endsOn) {
		throw new Error('endsOn property in Trip cannot be null');
	}

	let resultTrip = cloneDeep(tripToBeUpdated);
	resultTrip.days.push({
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.endsOn = resultTrip.endsOn ? addDaysToDate(resultTrip.endsOn, 1) : resultTrip.endsOn;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);

	if (resultTrip.days[resultTrip.days.length - 2].itinerary.length > 0) {
		const lastItem = resultTrip.days[resultTrip.days.length - 2].itinerary[
			resultTrip.days[resultTrip.days.length - 2].itinerary.length - 1
		];
		if (isStickyByDefault(lastItem.place)) {
			resultTrip = addPlaceToDay(resultTrip, lastItem.place, resultTrip.days.length - 1, 0);
		}
	}
	return resolveStickiness(resultTrip);
}

export function prependDayToTrip(tripToBeUpdated: Trip): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	let resultTrip = cloneDeep(tripToBeUpdated);

	resultTrip.days.unshift({
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.startsOn = subtractDaysFromDate(resultTrip.startsOn, 1);
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);

	if (resultTrip.days[1].itinerary.length > 0) {
		const firstItem = resultTrip.days[1].itinerary[0];
		if (isStickyByDefault(firstItem.place)) {
			resultTrip = addPlaceToDay(resultTrip, firstItem.place, 0, 0);
		}
	}
	return resolveStickiness(resultTrip);
}

export function removeDayFromTrip(tripToBeUpdated: Trip, dayIndex: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (tripToBeUpdated.days.length < dayIndex) {
		throw new Error('Invalid dayIndex');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);

	if (dayIndex === 0 && resultTrip.startsOn) {
		resultTrip.startsOn = addDaysToDate(resultTrip.startsOn, 1);
	} else {
		resultTrip.endsOn = subtractDaysFromDate(resultTrip.endsOn, 1);
	}

	resultTrip.days.splice(dayIndex, 1);
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resolveStickiness(resultTrip);
}

export function swapDaysInTrip(tripToBeUpdated: Trip, firstDayIndex: number, secondDayIndex: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.days[firstDayIndex]) {
		throw new Error('Invalid firstDayIndex');
	}

	if (!tripToBeUpdated.days[secondDayIndex]) {
		throw new Error('Invalid secondDayIndex');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	const firstDay: Day = resultTrip.days[firstDayIndex];
	const secondDay: Day = resultTrip.days[secondDayIndex];
	resultTrip.days[firstDayIndex] = secondDay;
	resultTrip.days[secondDayIndex] = firstDay;
	return resolveStickiness(resultTrip);
}

export function setTransport(trip: Trip, dayIndex: number, itemIndex: number, settings: TransportSettings|null): Trip {
	if (!trip.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!trip.days[dayIndex]) {
		throw new Error('Invalid dayIndex');
	}

	if (itemIndex && !trip.days[dayIndex].itinerary[itemIndex]) {
		throw new Error('Invalid itemIndex');
	}

	const resultTrip = cloneDeep(trip);
	resultTrip.days[dayIndex].itinerary[itemIndex].transportFromPrevious = settings;
	return resultTrip;
}

// Item methods
export function addPlaceToDay(
	tripToBeUpdated: Trip,
	placeToBeAdded: Place,
	dayIndex: number,
	positionInDay?: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.days[dayIndex]) {
		throw new Error('Invalid dayIndex');
	}

	if (
		typeof positionInDay !== 'undefined' &&
		positionInDay !== null &&
		(tripToBeUpdated.days[dayIndex].itinerary.length < positionInDay || positionInDay < 0)
	) {
		throw new Error('Invalid positionInDay');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	const itineraryItem: ItineraryItem = {
		place: placeToBeAdded,
		placeId: placeToBeAdded.id,
		startTime: null,
		duration: null,
		isSticky: false,
		note: null,
		transportFromPrevious: null
	};

	if (typeof positionInDay !== 'undefined' && positionInDay !== null) {
		resultTrip.days[dayIndex].itinerary.splice(positionInDay, 0, itineraryItem);
	} else {
		resultTrip.days[dayIndex].itinerary.push(itineraryItem);
	}
	return resolveStickiness(resultTrip);
}

export function movePlaceInDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionFrom: number,
	positionTo: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.days[dayIndex]) {
		throw new Error('Invalid dayIndex');
	}

	if (!tripToBeUpdated.days[dayIndex].itinerary[positionFrom]) {
		throw new Error('Invalid positionFrom');
	}

	if (!tripToBeUpdated.days[dayIndex].itinerary[positionTo]) {
		throw new Error('Invalid positionTo');
	}
	const resultTrip = cloneDeep(tripToBeUpdated);
	const itemToBeMoved: ItineraryItem = resultTrip.days[dayIndex].itinerary[positionFrom];
	resultTrip.days[dayIndex].itinerary.splice(positionFrom, 1);
	resultTrip.days[dayIndex].itinerary.splice(positionTo, 0, itemToBeMoved);
	return resolveStickiness(resultTrip);
}

export function removePlaceFromDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionInDay: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.days[dayIndex]) {
		throw new Error('Invalid dayIndex');
	}

	if (!tripToBeUpdated.days[dayIndex].itinerary[positionInDay]) {
		throw new Error('Invalid positionInDay');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	resultTrip.days[dayIndex].itinerary.splice(positionInDay, 1);
	return resolveStickiness(resultTrip);
}

export function replaceStickyPlace(
	trip: Trip,
	place: Place,
	dayIndex: number
): Trip {
	if (!trip.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!trip.days[dayIndex]) {
		throw new Error('Invalid dayIndex');
	}
	let resultTrip = cloneDeep(trip);
	if (
		trip.days &&
		trip.days[dayIndex] &&
		trip.days[dayIndex].itinerary.length &&
		trip.days[dayIndex].itinerary[trip.days[dayIndex].itinerary.length - 1].isSticky
	) {
		resultTrip = removePlaceFromDay(resultTrip, dayIndex, resultTrip.days[dayIndex].itinerary.length - 1);
		resultTrip = addPlaceToDay(resultTrip, place, dayIndex, resultTrip.days[dayIndex].itinerary.length);
	}
	const nextDayIndex = dayIndex + 1;
	if (
		trip.days &&
		trip.days[nextDayIndex] &&
		trip.days[nextDayIndex].itinerary.length &&
		trip.days[nextDayIndex].itinerary[0].isSticky
	) {
		resultTrip = removePlaceFromDay(resultTrip, nextDayIndex, 0);
		resultTrip = addPlaceToDay(resultTrip, place, nextDayIndex, 0);
	}
	return resolveStickiness(resultTrip);
}
