import { ChangeNotification } from '../Changes';
import { getPlaceDetailed, getPlacesDetailed, isStickyByDefault, Place } from '../Places';
import { getUserSettings } from '../User';
import { addDaysToDate } from '../Util/index';
import * as Dao from './DataAccess';
import * as TripManipulator from './Manipulator';
import { mapTripCreateRequest, putPlacesToTrip } from './Mapper';
import * as PositionFinder from './PositionFinder';
import {
	Day,
	hasDayStickyPlaceFromBothSides,
	isTransportAvoid,
	isTransportMode,
	isTransportType,
	ItineraryItem,
	TransportAvoid,
	TransportMode,
	TransportSettings,
	TransportType,
	Trip,
	TripConflictClientResolution,
	TripConflictHandler,
	TripConflictInfo,
	TripConflictResolution,
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
	TripConflictClientResolution,
	TripConflictHandler,
	TripConflictInfo,
	TripConflictResolution,
	TripMedia,
	TripPrivileges,
	TripUpdateData
};

export async function createTrip(startDate: string, name: string, placeId: string): Promise<Trip> {
	return await Dao.createTrip(mapTripCreateRequest(startDate, name, placeId));
}

export async function getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<Trip[]> {
	return await Dao.getTrips(dateFrom, dateTo);
}

export async function getTripsInTrash(): Promise<Trip[]> {
	return await Dao.getTripsInTrash();
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.getTripDetailed(id);
	if (tripWithoutPlaces.days) {
		const placesIds: string[] = getPlacesIdsFromTrip(tripWithoutPlaces);
		return putPlacesToTrip(tripWithoutPlaces, await getPlacesDetailed(placesIds, '300x300'));
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

export async function addDaysToTrip(id: string, count: number): Promise<Trip> {
	let tripToBeUpdated = await getTripDetailed(id);
	for (let i = 0; i < count; i++) {
		tripToBeUpdated = TripManipulator.addDay(tripToBeUpdated, await getUserSettings());
	}
	return Dao.updateTrip(tripToBeUpdated);
}

export async function prependDaysToTrip(id: string, count: number): Promise<Trip> {
	let tripToBeUpdated = await getTripDetailed(id);
	for (let i = 0; i < count; i++) {
		tripToBeUpdated = TripManipulator.prependDayToTrip(tripToBeUpdated, await getUserSettings());
	}
	return Dao.updateTrip(tripToBeUpdated);
}

export async function removeDayFromTrip(id: string, dayIndex: number): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.removeDayFromTrip(await getTripDetailed(id), dayIndex, await getUserSettings()));
}

export async function swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trip>  {
	return Dao.updateTrip(TripManipulator.swapDaysInTrip(
		await getTripDetailed(id),
		firstDayIndex,
		secondDayIndex,
		await getUserSettings()
	));
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
	return Dao.updateTrip(TripManipulator.movePlaceInDay(
		await getTripDetailed(id),
		dayIndex,
		positionFrom,
		positionTo,
		await getUserSettings())
	);
}

export async function removePlacesFromDay(id: string, dayIndex: number, positionsInDay: number[]): Promise<Trip> {
	return Dao.updateTrip(
		TripManipulator.removePlacesFromDay(await getTripDetailed(id), dayIndex, positionsInDay, await getUserSettings())
	);
}

export async function removeAllPlacesFromDay(id: string, dayIndex: number): Promise<Trip> {
	return Dao.updateTrip(
		TripManipulator.removeAllPlacesFromDay(await getTripDetailed(id), dayIndex, await getUserSettings())
	);
}

export async function setOvernightPlace(tripId: string, placeId: string, dayIndex: number): Promise<Trip> {
	return Dao.updateTrip(TripManipulator.addOrReplaceOvernightPlace(
		await getTripDetailed(tripId),
		await getPlaceDetailed(placeId, '300x300'),
		dayIndex, await getUserSettings())
	);
}

/**
 * @specification https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
 */
export async function addPlaceToDay(
	tripId: string,
	placeId: string,
	dayIndex: number,
	positionInDay?: number
): Promise<Trip> {
	let trip: Trip = await getTripDetailed(tripId);
	const place: Place = await getPlaceDetailed(placeId, '300x300');
	const userSettings = await getUserSettings();

	if (!trip.days || trip.days.length <= dayIndex) {
		throw new Error('Trip does not have day on index ' + dayIndex);
	}

	let nextDayItinerary: ItineraryItem[] | null = null;
	let dayItinerary: ItineraryItem[] = [];
	const nextDayIndex = dayIndex + 1;

	if (trip.days[nextDayIndex]) {
		nextDayItinerary = trip.days[nextDayIndex].itinerary;
	}

	if (typeof positionInDay === 'undefined' || positionInDay === null) {
		const firstPlaceInDay: Place|null = trip.days[dayIndex].itinerary[0] && trip.days[dayIndex].itinerary[0].place;
		if (firstPlaceInDay && hasDayStickyPlaceFromBothSides(trip, dayIndex) && firstPlaceInDay.id !== place.id) {
			trip = TripManipulator.addPlaceToDay(trip, firstPlaceInDay, dayIndex, userSettings, 1);
		}

		if (trip.days) {
			dayItinerary = trip.days[dayIndex].itinerary;
		}

		positionInDay = PositionFinder.findOptimalPosition(
			place,
			dayItinerary
		);
	}

	trip = TripManipulator.addPlaceToDay(trip, place, dayIndex, userSettings, positionInDay);

	if (
		(isStickyByDefault(place)) &&
		nextDayItinerary &&
		(!nextDayItinerary.length || !nextDayItinerary[0].isSticky)
	) {
		trip = TripManipulator.addPlaceToDay(trip, place, nextDayIndex, userSettings, 0);
	}

	trip = TripManipulator.replaceSiblingParentDestination(trip, dayIndex, positionInDay, place.parents, userSettings);
	return Dao.updateTrip(trip);
}

export async function handleTripChanges(changeNotifications: ChangeNotification[]): Promise<ChangeNotification[]> {
	const relevantChanges: ChangeNotification[] = [];

	for (const changeNotification of changeNotifications) {
		if (!changeNotification.id) {
			continue;
		}
		const tripId = changeNotification.id;
		if (changeNotification.change === 'updated' &&
			await Dao.shouldNotifyOnTripUpdate(tripId, changeNotification.version)
		) {
			relevantChanges.push(changeNotification);
		}

		if (changeNotification.change === 'deleted' && await Dao.isTripInCache(tripId)) {
			await Dao.deleteTripFromCache(tripId);
			relevantChanges.push(changeNotification);
		}
	}
	return relevantChanges;
}

export async function emptyTripsTrash(): Promise<string[]> {
	return Dao.emptyTripsTrash();
}
