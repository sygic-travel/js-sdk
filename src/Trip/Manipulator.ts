import { format } from 'fecha';

import { Day, Trip } from './index';

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
//
// // Item methods
// export async function addItem(
// 	tripId: string,
// 	itemGuid: string,
// 	dayIndex: number,
// 	positionInDay?: number): Promise<Trip> {
//
// }
// export async function moveItem(
// 	tripId: string,
// 	dayIndex: number,
// 	positionFrom: number,
// 	positionTo: number): Promise<Trip> {
//
// }
// export async function removeItem(
// 	tripId: string,
// 	dayIndex: number,
// 	positionInDay: number): Promise<Trip> {
//
// }

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
