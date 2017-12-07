import { ChangeNotification } from '../Changes';
import { DESTINATION_BREAK_LEVELS, getPlaceDetailed, getPlacesDetailed, Place } from '../Places';
import { getUserSettings, UserSettings } from '../User';
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
	TripMedia,
	TripPrivileges,
	TripTemplate,
	TripUpdateData,
	UNBREAKABLE_TRANSPORT_MODES,
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

	if (dataToUpdate.isDeleted !== undefined) {
		tripToBeUpdated.isDeleted = dataToUpdate.isDeleted;
	}

	return await Dao.updateTrip(tripToBeUpdated);
}

export async function addDaysToTrip(id: string, appendCount: number, prependCount: number): Promise<Trip> {
	let tripToBeUpdated = await getTripDetailed(id);
	for (let i = 0; i < appendCount; i++) {
		tripToBeUpdated = TripManipulator.addDay(tripToBeUpdated, await getUserSettings());
	}
	for (let i = 0; i < prependCount; i++) {
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

export async function updateItineraryItemUserData(
	tripId: string,
	dayIndex: number,
	itemIndex: number,
	startTime: number | null,
	duration: number | null,
	note: string | null,
	): Promise<Trip>  {
	return Dao.updateTrip(
		TripManipulator.updateItineraryItemUserData(
			await getTripDetailed(tripId),
			dayIndex,
			itemIndex,
			startTime,
			duration,
			note
		)
	);
}

export async function updateDayNote(
	tripId: string,
	dayIndex: number,
	note: string
): Promise<Trip> {
	return Dao.updateTrip(
		TripManipulator.updateDayNote(await getTripDetailed(tripId), dayIndex, note)
	);
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

export async function setOvernightPlace(tripId: string, placeId: string, dayIndexes: number[]): Promise<Trip> {
	let tripToBeUpdated: Trip = await getTripDetailed(tripId);
	const place: Place = await getPlaceDetailed(placeId, '300x300');
	const settings: UserSettings = await getUserSettings();
	dayIndexes.forEach((dayIndex: number) => {
		tripToBeUpdated = TripManipulator.addOrReplaceOvernightPlace(tripToBeUpdated, place, dayIndex, settings);
	});
	return Dao.updateTrip(tripToBeUpdated);
}

/**
 * See {@link https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary}
 */
export async function addPlaceToDay(
	tripId: string,
	placeId: string,
	dayIndex: number,
	positionInDay?: number
): Promise<Trip> {
	return addSequenceToDay(tripId, dayIndex, [placeId], [null], positionInDay);
}

export async function addSequenceToDay(
	tripId: string,
	dayIndex: number,
	placeIds: string[],
	transports?: (TransportSettings|null)[],
	positionInDay?: number
): Promise<Trip> {
	const initialLoadings = await Promise.all([
		getTripDetailed(tripId),
		getPlacesDetailed(placeIds, '300x300'),
		getUserSettings(),
	]);
	let trip: Trip = initialLoadings[0];
	const places: Place[] = initialLoadings[1];
	const userSettings: UserSettings = initialLoadings[2];

	if (!trip.days || !trip.days[dayIndex]) {
		throw new Error('Trip does not have day on index ' + dayIndex);
	}

	if (typeof positionInDay === 'undefined' || positionInDay === null) {
		const destinations = await getPlacesDetailed(places[0].parents, '300x300');
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
			trip = TripManipulator.duplicateItineraryItem(trip, dayIndex, addToTripInstructions.position, true);
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

export async function getTripTemplates(placeId: string): Promise<TripTemplate[]> {
	const tripTemplatesWithoutPlaces: TripTemplate[] = await Dao.getTripTemplates(placeId);
	return await Promise.all(tripTemplatesWithoutPlaces.map(populateTripTemplateWithPlaces));
}

async function populateTripTemplateWithPlaces(tripTemplateWithoutPlaces: TripTemplate): Promise<TripTemplate> {
	tripTemplateWithoutPlaces.trip = await populateTripWithPlaces(tripTemplateWithoutPlaces.trip);
	return tripTemplateWithoutPlaces;
}

export async function applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.applyTripTemplate(tripId, templateId, dayIndex);
	return await populateTripWithPlaces(tripWithoutPlaces);
}

async function populateTripWithPlaces(trip: Trip): Promise<Trip> {
	const placesIds: string[] = getPlacesIdsFromTrip(trip);
	return putPlacesToTrip(trip, await getPlacesDetailed(placesIds, '300x300'));
}
