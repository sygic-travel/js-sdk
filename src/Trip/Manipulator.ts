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

// export async function removeDay(tripToBeUpdated: Trip, dayIndex: number): Trip {
// 	if (tripToBeUpdated.days) {
// 		tripToBeUpdated.days.splice(dayIndex, 1);
//
// 		if (dayIndex === 0) {
//
// 		}
//
// 		if (dayIndex === )
// 	}
//
// 	return tripToBeUpdated;
// }
//
// export async function swapdays(tripId: string, firstDayIndex: string, secondDayIndex: string): Promise<Trip> {
//
// }
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
