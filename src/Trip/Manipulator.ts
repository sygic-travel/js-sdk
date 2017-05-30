import * as cloneDeep from 'lodash.clonedeep';

import { Day, Trip } from '.';
import { Place } from '../Places';
import { addDayToDate, subtractDayToDate } from '../Util';
import { ItineraryItem } from './Trip';

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
		note: null
	} as Day);
	resultTrip.endsOn = addDayToDate(resultTrip.endsOn);
	return resultTrip;
}

export function addDayToBeginning(tripToBeUpdated: Trip): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);

	resultTrip.days.unshift({
		itinerary: [],
		note: null
	} as Day);

	if (resultTrip.startsOn) {
		resultTrip.startsOn = subtractDayToDate(resultTrip.startsOn);
	}
	return resultTrip;
}

export function removeDay(tripToBeUpdated: Trip, dayIndex: number): Trip {
	if (!tripToBeUpdated.days) {
		throw new Error('days property in Trip cannot be null');
	}

	if (tripToBeUpdated.days.length < dayIndex) {
		throw new Error('Invalid dayIndex');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);

	if (dayIndex === 0 && resultTrip.startsOn) {
		resultTrip.startsOn = addDayToDate(resultTrip.startsOn);
	} else {
		resultTrip.endsOn = subtractDayToDate(resultTrip.endsOn);
	}

	resultTrip.days.splice(dayIndex, 1);
	return resultTrip;
}

export function swapDays(tripToBeUpdated: Trip, firstDayIndex: number, secondDayIndex: number): Trip {
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
	const firstItineraryItem: ItineraryItem = resultTrip.days[0].itinerary[0];
	const secondItineraryItem: ItineraryItem = resultTrip.days[0].itinerary[1];
	resultTrip.days[0].itinerary[0] = secondItineraryItem;
	resultTrip.days[0].itinerary[1] = firstItineraryItem;
	return resultTrip;
}

export function removePlaceInDay(
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
