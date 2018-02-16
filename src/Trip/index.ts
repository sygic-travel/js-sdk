import { ChangeNotification } from '../Changes';
import { DESTINATION_BREAK_LEVELS, getDetailedPlaces, Place } from '../Places';
import { getUserSettings, UserSettings } from '../Session';
import { addDaysToDate } from '../Util/index';
import * as Dao from './DataAccess';
import * as TripManipulator from './Manipulator';
import { mapTripCreateRequest, putPlacesToTrip } from './Mapper';
import { AddToTripInstructions, getAddToTripInstructions } from './PositionFinder';

import {
	Day,
	isTransportAvoid,
	isTransportMode,
	ItineraryItem,
	TransportAvoid,
	TransportMode,
	TransportSettings,
	Trip,
	TripConflictClientResolution,
	TripConflictHandler,
	TripConflictInfo,
	TripConflictResolution,
	TripEditor,
	TripInfo,
	TripMedia,
	TripPrivileges,
	TripTemplate,
	TripUpdateData,
	UNBREAKABLE_TRANSPORT_MODES,
} from './Trip';

export {
	Day,
	Dao,
	ItineraryItem,
	isTransportAvoid,
	isTransportMode,
	TransportAvoid,
	TransportMode,
	TransportSettings,
	Trip,
	TripConflictClientResolution,
	TripConflictHandler,
	TripConflictInfo,
	TripConflictResolution,
	TripEditor,
	TripInfo,
	TripMedia,
	TripPrivileges,
	TripTemplate,
	TripUpdateData,
	UNBREAKABLE_TRANSPORT_MODES,
};

export async function getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<TripInfo[]> {
	return Dao.getTrips(dateFrom, dateTo);
}

export async function getTripsInTrash(): Promise<TripInfo[]> {
	return Dao.getTripsInTrash();
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.getTripDetailed(id);
	if (tripWithoutPlaces.days) {
		const placesIds: string[] = getPlacesIdsFromTrip(tripWithoutPlaces);
		return putPlacesToTrip(tripWithoutPlaces, await getDetailedPlaces(placesIds, '300x300'));
	}
	return tripWithoutPlaces;
}

export async function cloneTrip(id: string): Promise<string> {
	return Dao.cloneTrip(id);
}

export function getPlacesIdsFromTrip(trip: Trip): string[] {
	if (!trip.days.length) {
		return [];
	}

	const initAcc: string[] = [];
	return trip.days.reduce((acc, day: Day): string[] => ([
		...acc,
		...day.itinerary.map((itineraryItem: ItineraryItem): string => (itineraryItem.placeId))
	]), initAcc);
}

export async function saveTrip(trip: Trip): Promise<Trip> {
	return Dao.updateTrip(trip);
}

export function getTripEditor(): TripEditor {
	return {
		addDaysToTrip: TripManipulator.addDaysToTrip,
		removeDay: TripManipulator.removeDayFromTrip,
		swapDaysInTrip: TripManipulator.swapDaysInTrip,
		addPlaceToDay: TripManipulator.addPlaceToDay,
		duplicatePlace: TripManipulator.duplicateItineraryItem,
		movePlaceInDay: TripManipulator.movePlaceInDay,
		removePlacesFromDay: TripManipulator.removePlacesFromDay,
		removeAllPlacesFromDay: TripManipulator.removeAllPlacesFromDay,
		removePlaceFromDaysByPlaceId: TripManipulator.removePlaceFromDaysByPlaceId,
		addOrReplaceOvernightPlace: TripManipulator.addOrReplaceOvernightPlace,
		setTransport: TripManipulator.setTransport,
		updatePlaceUserData: TripManipulator.updateItineraryItemUserData,
		updateDayNote: TripManipulator.updateDayNote,
		smartAddPlaceToDay: addPlaceToDay,
		smartAddSequenceToDay: addSequenceToDay,
		createTrip,
		setStartDate
	} as TripEditor;
}

/**
 * See {@link https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary}
 */
export async function addPlaceToDay(
	trip: Trip,
	placeId: string,
	dayIndex: number,
	positionInDay?: number
): Promise<Trip> {
	return addSequenceToDay(trip, dayIndex, [placeId], [null], positionInDay);
}

export async function addSequenceToDay(
	trip: Trip,
	dayIndex: number,
	placeIds: string[],
	transports?: (TransportSettings | null)[],
	positionInDay?: number
): Promise<Trip> {
	const initialLoadings = await Promise.all([
		getDetailedPlaces(placeIds, '300x300'),
		getUserSettings(),
	]);
	const places: Place[] = initialLoadings[0];
	const userSettings: UserSettings = initialLoadings[1];

	if (!trip.days || !trip.days[dayIndex]) {
		throw new Error('Trip does not have day on index ' + dayIndex);
	}

	if (typeof positionInDay === 'undefined' || positionInDay === null) {
		const destinations = await getDetailedPlaces(places[0].parents, '300x300');
		const suitableDestinations = destinations.filter((place) => DESTINATION_BREAK_LEVELS.includes(place.level));
		const addToTripInstructions: AddToTripInstructions = getAddToTripInstructions(
			places[0],
			trip,
			dayIndex,
			suitableDestinations.map((destination) => destination.id),
			userSettings
		);
		positionInDay = addToTripInstructions.position;
		if (addToTripInstructions.shouldDuplicate) {
			trip = TripManipulator.duplicateItineraryItem(trip, dayIndex, addToTripInstructions.position, true, userSettings);
			positionInDay++;
		}
	}

	let sequenceIndex = 0;
	for (const place of places) {
		trip = TripManipulator.addPlaceToDay(
			trip,
			place,
			dayIndex,
			userSettings,
			positionInDay + sequenceIndex
		);
		if (transports && transports[sequenceIndex]) {
			trip = TripManipulator.setTransport(trip, dayIndex, positionInDay + sequenceIndex, transports[sequenceIndex]);
		}
		sequenceIndex++;
	}
	return trip;
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

export async function getTripTemplates(placeId: string): Promise<TripTemplate[]> {
	const tripTemplatesWithoutPlaces: TripTemplate[] = await Dao.getTripTemplates(placeId);
	return Promise.all(tripTemplatesWithoutPlaces.map(populateTripTemplateWithPlaces));
}

export async function applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.applyTripTemplate(tripId, templateId, dayIndex);
	return populateTripWithPlaces(tripWithoutPlaces);
}

export async function ensureTripSyncedToServer(tripId: string): Promise<void> {
	return Dao.syncChangedTripToServer(tripId);
}

async function populateTripTemplateWithPlaces(tripTemplateWithoutPlaces: TripTemplate): Promise<TripTemplate> {
	tripTemplateWithoutPlaces.trip = await populateTripWithPlaces(tripTemplateWithoutPlaces.trip);
	return tripTemplateWithoutPlaces;
}

async function populateTripWithPlaces(trip: Trip): Promise<Trip> {
	const placesIds: string[] = getPlacesIdsFromTrip(trip);
	return putPlacesToTrip(trip, await getDetailedPlaces(placesIds, '300x300'));
}

async function createTrip(startDate: string, name: string, daysCount: number, placeId?: string): Promise<Trip> {
	return Dao.createTrip(mapTripCreateRequest(startDate, name, daysCount, placeId));
}

function setStartDate(trip: Trip, startsOn: string): Trip {
	trip.startsOn = startsOn;
	trip.endsOn = addDaysToDate(startsOn, trip.days ? trip.days.length - 1 : 0);
	return trip;
}
