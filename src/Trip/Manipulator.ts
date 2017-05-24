import * as moment from 'moment';
import { Day, Trip } from './index';

// Day methods
export function addDay(tripToBeUpdated: Trip): Trip {
	if (tripToBeUpdated.days) {
		tripToBeUpdated.days.push({
			itinerary: [],
			note: null
		} as Day);

		if (tripToBeUpdated.endsOn) {
			const newEndDate: moment.Moment = moment(tripToBeUpdated.endsOn);
			tripToBeUpdated.endsOn = newEndDate.add(1, 'days').format('YYYY-MM-DD');
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
			const newStartDate: moment.Moment = moment(tripToBeUpdated.startsOn);
			tripToBeUpdated.startsOn = newStartDate.subtract(1, 'days').format('YYYY-MM-DD');
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
			const newStartDate: moment.Moment = moment(tripToBeUpdated.startsOn);
			tripToBeUpdated.startsOn = newStartDate.add(1, 'days').format('YYYY-MM-DD');
		}

		if (dayIndex + 1 === tripToBeUpdated.days.length && tripToBeUpdated.endsOn) {
			const newEndDate: moment.Moment = moment(tripToBeUpdated.endsOn);
			tripToBeUpdated.endsOn = newEndDate.subtract(1, 'days').format('YYYY-MM-DD');
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
