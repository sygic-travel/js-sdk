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

// export async function addDayToBeginning(tripId: string): Promise<Trip> {
//
// }
//
// export async function removeDay(tripId: string, dayIndex: number): Promise<Trip> {
//
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
