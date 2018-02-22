import { camelizeKeys, decamelizeKeys } from 'humps';
import { cloneDeep } from '../Util';

import { Place } from '../Places';
import { Waypoint } from '../Route';
import { UserSettings } from '../Session';
import { Day, ItineraryItem, Trip, TripCreateRequest, TripInfo, TripMedia, TripPrivileges, TripTemplate} from './Trip';
import { decorateDaysWithDate } from './Utility';

const MAX_TRIP_DAYS_COUNT = 81;

export const mapTripListApiResponseToTripsList = (trips: any): Trip[] => {
	return trips.map((trip) => {
		return mapTripInfo(trip);
	});
};

export const mapTripDetailedApiResponseToTrip = (tripDetailed: any, userSettings: UserSettings | null): Trip => {
	const trip: Trip = {
		...mapTripInfo(tripDetailed),
		days: decorateDaysWithDate(tripDetailed.starts_on, mapTripDays(tripDetailed))
	};
	return resolveStickiness(trip, userSettings);
};

export const mapTripCreateRequestToApiFormat = (request: TripCreateRequest): object => {
	const data = {
		name: request.name,
		starts_on: request.startsOn,
		days: request.days.map(mapTripDayToApiFormat),
		base_version: null,
		updated_at: null,
		privacy_level: request.privacyLevel,
		ends_on: request.startsOn,
		is_deleted: request.isDeleted,
	};
	return data;
};

export const mapTripCreateRequest = (
	startsOn: string,
	name: string,
	daysCount: number,
	placeId?: string
): TripCreateRequest => {
	if (daysCount < 1 || daysCount > MAX_TRIP_DAYS_COUNT) {
		throw new Error(`Invalid trip days count. Value between 1 and ${MAX_TRIP_DAYS_COUNT} expected.`);
	}

	const days: Day[] = Array(daysCount).fill(null).map(() => ({note: null, date: null, itinerary: []}));
	if (placeId) {
		days[0].itinerary = [{
			placeId,
			place: null,
			note: null,
			duration: null,
			startTime: null,
			transportFromPrevious: null,
			isSticky: false,
			isStickyFirstInDay: false,
			isStickyLastInDay: false
		}];
	}

	return {
		name,
		startsOn,
		days,
		privacyLevel: 'private',
		endsOn: startsOn,
		isDeleted: false,
	} as TripCreateRequest;
};

const mapTripInfo = (trip): TripInfo => {
	return {
		id: trip.id,
		ownerId: trip.owner_id,
		privacyLevel: trip.privacy_level,
		name: trip.name,
		version: trip.version,
		startsOn: trip.starts_on,
		endsOn: trip.ends_on,
		updatedAt: trip.updated_at,
		isDeleted: trip.is_deleted,
		url: trip.url,
		media: camelizeKeys(trip.media) as TripMedia,
		privileges: camelizeKeys(trip.privileges) as TripPrivileges,
	} as TripInfo;
};

const mapTripDays = (trip): Day[] => trip.days.map((day) => ({
	note: day.note,
	date: null,
	itinerary: day.itinerary.map((itineraryItem) => ({
		placeId: itineraryItem.place_id,
		startTime: itineraryItem.start_time,
		duration: itineraryItem.duration,
		note: itineraryItem.note,
		isSticky: null,
		isStickyFirstInDay: null,
		isStickyLastInDay: null,
		transportFromPrevious: itineraryItem.transport_from_previous ? {
			mode: itineraryItem.transport_from_previous.mode,
			avoid: itineraryItem.transport_from_previous.avoid,
			startTime: itineraryItem.transport_from_previous.start_time,
			duration: itineraryItem.transport_from_previous.duration,
			note: itineraryItem.transport_from_previous.note,
			routeId: itineraryItem.transport_from_previous.route_id ? itineraryItem.transport_from_previous.route_id : null,
			waypoints: itineraryItem.transport_from_previous.waypoints.map((waypoint) => ({
				placeId: waypoint.place_id,
				location: waypoint.location as Location
			}))
		} : null
	} as ItineraryItem))
} as Day));

/**
 * See {@link https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary}
 */
export const resolveStickiness = (inputTrip: Trip, userSettings: UserSettings | null): Trip => {
	const trip = cloneDeep(inputTrip);
	if (trip.days === null) {
		return trip;
	}
	let prevDay: Day | null;
	let nextDay: Day | null;
	trip.days.forEach((day: Day, index: number) => {
		day.itinerary.forEach((item: ItineraryItem) => {
			item.isSticky = false;
			item.isStickyFirstInDay = false;
			item.isStickyLastInDay = false;
		});

		if (userSettings &&
			index === 0 &&
			day.itinerary.length > 0 &&
			(
				(userSettings.homePlaceId && day.itinerary[0].placeId === userSettings.homePlaceId) ||
				(userSettings.workPlaceId && day.itinerary[0].placeId === userSettings.workPlaceId)
			)
		) {
			day.itinerary[0].isSticky = true;
			day.itinerary[0].isStickyFirstInDay = true;
		}

		if (prevDay &&
			prevDay.itinerary.length &&
			day.itinerary.length &&
			day.itinerary[0].placeId === prevDay.itinerary[prevDay.itinerary.length - 1].placeId
		) {
			day.itinerary[0].isSticky = true;
			day.itinerary[0].isStickyFirstInDay = true;
		}
		nextDay = trip.days && trip.days[index + 1] ? trip.days[index + 1] : null;
		if (nextDay &&
			nextDay.itinerary.length &&
			day.itinerary.length &&
			day.itinerary[day.itinerary.length - 1].placeId === nextDay.itinerary[0].placeId
		) {
			day.itinerary[day.itinerary.length - 1].isSticky = true;
			day.itinerary[day.itinerary.length - 1].isStickyLastInDay = true;
		}

		if (userSettings &&
			nextDay === null &&
			day.itinerary.length > 0 &&
			(
				(userSettings.homePlaceId && day.itinerary[day.itinerary.length - 1].placeId === userSettings.homePlaceId) ||
				(userSettings.workPlaceId && day.itinerary[day.itinerary.length - 1].placeId === userSettings.workPlaceId)
			)
		) {
			day.itinerary[day.itinerary.length - 1].isSticky = true;
			day.itinerary[day.itinerary.length - 1].isStickyLastInDay = true;
		}

		prevDay = day;
	});
	return trip;
};

export function putPlacesToTrip(trip: Trip, places: Place[]): Trip {
	if (trip.days) {
		trip.days.forEach((day: Day) => day.itinerary.forEach((itineraryItem: ItineraryItem) => {
			const filteredPlaces: Place[] = places.filter((place: Place) => (place.id === itineraryItem.placeId));
			if (filteredPlaces.length > 0) {
				itineraryItem.place = filteredPlaces[0];
			}
		}));
	}
	return trip;
}

export const mapTripToApiFormat = (trip: Trip): object => {
	return {
		id: trip.id,
		owner_id: trip.ownerId,
		privacy_level: trip.privacyLevel,
		name: trip.name,
		version: trip.version,
		starts_on: trip.startsOn,
		ends_on: trip.endsOn,
		updated_at: trip.updatedAt,
		is_deleted: trip.isDeleted,
		url: trip.url,
		media: decamelizeKeys(trip.media),
		privileges: decamelizeKeys(trip.privileges),
		days: trip.days && trip.days.map(mapTripDayToApiFormat)
	};
};

export const mapTripToApiUpdateFormat = (trip: Trip): object => {
	const apiFormat = mapTripToApiFormat(trip) as any;
	if (apiFormat.hasOwnProperty('version')) {
		apiFormat.base_version = apiFormat.version;
		delete apiFormat.version;
	}
	return apiFormat;
};

const mapTripDayToApiFormat = (day: Day): object => {
	return {
		note: day.note,
		itinerary: day.itinerary.map((itineraryItem: ItineraryItem) => ({
			place_id: itineraryItem.placeId,
			start_time: itineraryItem.startTime,
			duration: itineraryItem.duration,
			note: itineraryItem.note,
			transport_from_previous: itineraryItem.transportFromPrevious ? {
				mode: itineraryItem.transportFromPrevious.mode,
				avoid: itineraryItem.transportFromPrevious.avoid,
				start_time: itineraryItem.transportFromPrevious.startTime,
				duration: itineraryItem.transportFromPrevious.duration,
				note: itineraryItem.transportFromPrevious.note,
				route_id: itineraryItem.transportFromPrevious.routeId,
				waypoints: itineraryItem.transportFromPrevious.waypoints.map((waypoint: Waypoint) => ({
					place_id: waypoint.placeId,
					location: waypoint.location
				}))
			} : null
		})),
	};
};

export const mapTripTemplateApiResponse = (tripTemplate: any, userSettings: UserSettings): TripTemplate => ({
	id: tripTemplate.id,
	description: tripTemplate.description,
	duration: tripTemplate.duration,
	trip: mapTripDetailedApiResponseToTrip(tripTemplate.trip, userSettings)
});
