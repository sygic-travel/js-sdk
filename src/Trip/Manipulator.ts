import { format } from 'fecha';

import { Place } from '../Places';
import { Day, Trip } from './index';
import { ItineraryItem } from './Trip';

function addDayToDate(date: string): string {
	const d = new Date(date);
	d.setDate(d.getDate() + 1);
	return format(d, 'YYYY-MM-DD');
}

function subtractDayToDate(date: string): string {
	const d = new Date(date);
	d.setDate(d.getDate() - 1);
	return format(d, 'YYYY-MM-DD');
}

// Day methods
export function addDay(tripToBeUpdated: Trip): Trip {
	if (tripToBeUpdated.days) {
		tripToBeUpdated.days.push({
			itinerary: [],
			note: null
		} as Day);

		if (tripToBeUpdated.endsOn) {
			tripToBeUpdated.endsOn = addDayToDate(tripToBeUpdated.endsOn);
		}
	}

	return tripToBeUpdated;
}

export function addDayToBeginning(tripToBeUpdated: Trip): Trip {
	if (tripToBeUpdated.days) {
		tripToBeUpdated.days.unshift({
			itinerary: [],
			note: null
		} as Day);

		if (tripToBeUpdated.startsOn) {
			tripToBeUpdated.startsOn = subtractDayToDate(tripToBeUpdated.startsOn);
		}
	}

	return tripToBeUpdated;
}

export function removeDay(tripToBeUpdated: Trip, dayIndex: number): Trip {
	if (tripToBeUpdated.days) {
		if (tripToBeUpdated.days.length < dayIndex) {
			throw new Error('Invalid dayIndex');
		}

		if (dayIndex === 0 && tripToBeUpdated.startsOn) {
			tripToBeUpdated.startsOn = addDayToDate(tripToBeUpdated.startsOn);
		}

		if (dayIndex + 1 === tripToBeUpdated.days.length && tripToBeUpdated.endsOn) {
			tripToBeUpdated.endsOn = subtractDayToDate(tripToBeUpdated.endsOn);
		}

		tripToBeUpdated.days.splice(dayIndex, 1);
	}

	return tripToBeUpdated;
}

export function swapDays(tripToBeUpdated: Trip, firstDayIndex: number, secondDayIndex: number): Trip {
	if (tripToBeUpdated.days) {
		if (!tripToBeUpdated.days[firstDayIndex]) {
			throw new Error('Invalid firstDayIndex');
		}

		if (!tripToBeUpdated.days[secondDayIndex]) {
			throw new Error('Invalid secondDayIndex');
		}

		const firstDay: Day = tripToBeUpdated.days[firstDayIndex];
		const secondDay: Day = tripToBeUpdated.days[secondDayIndex];

		tripToBeUpdated.days[firstDayIndex] = secondDay;
		tripToBeUpdated.days[secondDayIndex] = firstDay;
	}

	return tripToBeUpdated;
}

// Item methods
export function addPlaceToDay(
	tripToBeUpdated: Trip,
	placeToBeAdded: Place,
	dayIndex: number,
	positionInDay?: number): Trip {
	if (tripToBeUpdated.days) {
		if (!tripToBeUpdated.days[dayIndex]) {
			throw new Error('Invalid dayIndex');
		}

		if (positionInDay && !tripToBeUpdated.days[dayIndex].itinerary[positionInDay]) {
			throw new Error('Invalid positionInDay');
		}

		const itineraryItem: ItineraryItem = {
			place: placeToBeAdded,
			placeId: placeToBeAdded.id,
			startTime: null,
			duration: null,
			note: null,
			transportFromPrevious: null
		};

		if (positionInDay) {
			tripToBeUpdated.days[dayIndex].itinerary.splice(positionInDay, 0, itineraryItem);
		} else {
			tripToBeUpdated.days[dayIndex].itinerary.push(itineraryItem);
		}
	}

	return tripToBeUpdated;
}

export function movePlaceInDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionFrom: number,
	positionTo: number): Trip {
	if (tripToBeUpdated.days) {
		if (!tripToBeUpdated.days[dayIndex]) {
			throw new Error('Invalid dayIndex');
		}

		if (!tripToBeUpdated.days[dayIndex].itinerary[positionFrom]) {
			throw new Error('Invalid positionFrom');
		}

		if (!tripToBeUpdated.days[dayIndex].itinerary[positionTo]) {
			throw new Error('Invalid positionTo');
		}

		const firstItineraryItem: ItineraryItem = tripToBeUpdated.days[0].itinerary[0];
		const secondItineraryItem: ItineraryItem = tripToBeUpdated.days[0].itinerary[1];
		tripToBeUpdated.days[0].itinerary[0] = secondItineraryItem;
		tripToBeUpdated.days[0].itinerary[1] = firstItineraryItem;
	}

	return tripToBeUpdated;
}

export function removePlaceInDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionInDay: number): Trip {
	if (tripToBeUpdated.days) {
		if (!tripToBeUpdated.days[dayIndex]) {
			throw new Error('Invalid dayIndex');
		}

		if (!tripToBeUpdated.days[dayIndex].itinerary[positionInDay]) {
			throw new Error('Invalid positionInDay');
		}

		tripToBeUpdated.days[dayIndex].itinerary.splice(positionInDay, 1);
	}

	return tripToBeUpdated;
}
