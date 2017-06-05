import * as cloneDeep from 'lodash.clonedeep';

import { Day, Trip } from '.';
import { Place } from '../Places';
import { addDaysToDate, subtractDaysFromDate } from '../Util';
import { ItineraryItem } from './Trip';
import { decorateDaysWithDate } from './Utility';

// Day methods
export function addDay(tripToBeUpdated: Trip): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (!tripToBeUpdated.endsOn) {
		throw new Error('endsOn property in Trip cannot be null');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	resultTrip.days.push({
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.endsOn = resultTrip.endsOn ? addDaysToDate(resultTrip.endsOn, 1) : resultTrip.endsOn;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resultTrip;
}

export function prependDayToTrip(tripToBeUpdated: Trip): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);

	resultTrip.days.unshift({
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.startsOn = subtractDaysFromDate(resultTrip.startsOn, 1);
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resultTrip;
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
	return resultTrip;
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

	if (positionInDay && !tripToBeUpdated.days[dayIndex].itinerary[positionInDay]) {
		throw new Error('Invalid positionInDay');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	const itineraryItem: ItineraryItem = {
		place: placeToBeAdded,
		placeId: placeToBeAdded.id,
		startTime: null,
		duration: null,
		note: null,
		transportFromPrevious: null
	};

	if (positionInDay) {
		resultTrip.days[dayIndex].itinerary.splice(positionInDay, 0, itineraryItem);
	} else {
		resultTrip.days[dayIndex].itinerary.push(itineraryItem);
	}
	return resultTrip;
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
	return resultTrip;
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
	return resultTrip;
}
