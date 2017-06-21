import { ChangeNotification } from '../Changes';
import { Dao as placesDao, getPlaceDetailed, getPlacesDetailed, isStickyByDefault, Place } from '../Places';
import { addDaysToDate } from '../Util/index';
import * as Dao from './DataAccess';
import * as TripManipulator from './Manipulator';
import { mapTripCreateRequest, putPlacesToTrip } from './Mapper';
import * as PositionFinder from './PositionFinder';
import {
	Day,
	isTransportAvoid,
	isTransportMode,
	isTransportType,
	ItineraryItem,
	TransportAvoid,
	TransportMode,
	TransportSettings,
	TransportType,
	Trip,
	TripMedia,
	TripPrivileges,
	TripUpdateData
} from './Trip';

export {
	Day,
	Dao,
	ItineraryItem,
	isTransportAvoid,
	isTransportMode,
	isTransportType,
	TransportAvoid,
	TransportMode,
	TransportSettings,
	TransportType,
	Trip,
	TripMedia,
	TripPrivileges,
	TripUpdateData
};

export async function createTrip(startDate: string, name: string, placeId: string): Promise<Trip> {
	return await Dao.createTrip(mapTripCreateRequest(startDate, name, placeId));
}

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	return await Dao.getTrips(dateTo, dateFrom);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.getTripDetailed(id);
	if (tripWithoutPlaces.days) {
		const placesGuids: string[] = getPlacesIdsFromTrip(tripWithoutPlaces);
		return putPlacesToTrip(tripWithoutPlaces, await getPlacesDetailed(placesGuids, '300x300'));
	}
	return tripWithoutPlaces;
}

export async function cloneTrip(id: string): Promise<string> {
	return Dao.cloneTrip(id);
}

export function getPlacesIdsFromTrip(trip: Trip): string[] {
	if (!trip.days) {
		return [];
	}

	const initAcc: string[] = [];
	return trip.days.reduce((acc, day: Day): string[] => ([
		...acc,
		...day.itinerary.map((itineraryItem: ItineraryItem): string => (itineraryItem.placeId))
	]), initAcc);
}

export async function updateTrip(id: string, dataToUpdate: TripUpdateData): Promise<Trip> {
	const tripToBeUpdated: Trip = await getTripDetailed(id);

	if (dataToUpdate.name) {
		tripToBeUpdated.name = dataToUpdate.name;
	}

	if (dataToUpdate.startsOn) {
		tripToBeUpdated.startsOn = dataToUpdate.startsOn;
		tripToBeUpdated.endsOn = addDaysToDate(dataToUpdate.startsOn,
			tripToBeUpdated.days ? tripToBeUpdated.days.length - 1 : 0);
	}

	if (dataToUpdate.privacyLevel) {
		tripToBeUpdated.privacyLevel = dataToUpdate.privacyLevel;
	}

	if (dataToUpdate.isDeleted) {
		tripToBeUpdated.isDeleted = dataToUpdate.isDeleted;
	}

	return await Dao.updateTrip(tripToBeUpdated);
}

export async function addDayToTrip(id: string): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.addDay(await getTripDetailed(id)));
}

export async function prependDayToTrip(id: string): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.prependDayToTrip(await getTripDetailed(id)));
}

export async function removeDayFromTrip(id: string, dayIndex: number): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.removeDayFromTrip(await getTripDetailed(id), dayIndex));
}

export async function swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trip>  {
	return Dao.updateTrip(TripManipulator.swapDaysInTrip(await getTripDetailed(id), firstDayIndex, secondDayIndex));
}

export async function setTransport(
	tripId: string,
	dayIndex: number,
	itemIndex: number,
	settings: TransportSettings): Promise<Trip>  {
	return Dao.updateTrip(TripManipulator.setTransport(await getTripDetailed(tripId), dayIndex, itemIndex, settings));
}

export async function movePlaceInDay(
	id: string,
	dayIndex: number,
	positionFrom: number,
	positionTo: number): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.movePlaceInDay(await getTripDetailed(id), dayIndex, positionFrom, positionTo));
}

export async function removePlaceFromDay(id: string, dayIndex: number, positionInDay: number): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.removePlaceFromDay(await getTripDetailed(id), dayIndex, positionInDay));
}

/**
 * @specification https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
 */
export async function addPlaceToDay(
	tripId: string,
	placeId: string,
	dayIndex: number,
	positionInDay?: number,
	replaceSticky?: boolean
): Promise<Trip> {
	let trip: Trip = await getTripDetailed(tripId);
	const place: Place = await getPlaceDetailed(placeId, '300x300');

	let day: Day;
	if (trip.days && trip.days[dayIndex]) {
		day = trip.days[dayIndex];
	} else {
		throw new Error('Trip does not have day on index ' + dayIndex);
	}

	if (typeof positionInDay !== 'undefined' && positionInDay !== null) {
		return Dao.updateTrip(TripManipulator.addPlaceToDay(trip, place, dayIndex, positionInDay));
	}

	if (replaceSticky) {
		return Dao.updateTrip(TripManipulator.replaceStickyPlace(trip, place, dayIndex));
	}

	let dayItems: ItineraryItem[] = [];
	const dayPlaces = await placesDao.getPlacesFromTripDay(day);
	trip = putPlacesToTrip(trip, dayPlaces);
	if (trip.days) {
		dayItems = trip.days[dayIndex].itinerary;
	}

	positionInDay = PositionFinder.findOptimalPosition(
		place,
		dayItems
	);
	trip = TripManipulator.addPlaceToDay(trip, place, dayIndex, positionInDay);
	const nextDayIndex = dayIndex + 1;

	if (
		(isStickyByDefault(place)) &&
		trip.days &&
		trip.days[nextDayIndex] &&
		(!trip.days[nextDayIndex].itinerary.length || !trip.days[nextDayIndex].itinerary[0].isSticky)
	) {
		trip = TripManipulator.addPlaceToDay(trip, place, nextDayIndex, 0);
	}
	return Dao.updateTrip(trip);
}

export async function handleTripChanges(changeNotifications: ChangeNotification[]): Promise<void> {
	await Promise.all(changeNotifications.map((changeNotification: ChangeNotification) => {
		if (!changeNotification.id) {
			return Promise.resolve();
		}
		const tripId = changeNotification.id;
		if (changeNotification.change === 'updated') {
			return Dao.handleTripChangeNotification(tripId);
		}
		return Dao.deleteTripFromCache(tripId);
	}));
}
