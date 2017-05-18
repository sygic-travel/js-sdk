import { camelizeKeys, decamelizeKeys } from 'humps';

import { Place } from '../Places';
import { Day, ItineraryItem, Trip, TripMedia, TripPrivileges } from './Trip';

export const mapTripListApiResponseToTripsList = (trips: any): Trip[] => {
	return trips.map((trip) => {
		return mapTrip(trip, null);
	});
};

export const mapTripDetailedApiResponseToTrip = (tripDetailed: any): Trip => {
	return mapTrip(tripDetailed, mapTripDays(tripDetailed));
};

export const mapTrip = (trip, days: Day[] | null): Trip => {
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
		days
	} as Trip;
};

const mapTripDays = (trip): Day[] => trip.days.map((day) => ({
	note: day.note,
	itinerary: day.itinerary.map((itineraryItem) => ({
		placeId: itineraryItem.place_id,
		startTime: itineraryItem.start_time,
		duration: itineraryItem.duration,
		note: itineraryItem.note,
		transportFromPrevious: itineraryItem.transport_from_previous ? {
			mode: itineraryItem.transport_from_previous.mode,
			type: itineraryItem.transport_from_previous.type,
			avoid: itineraryItem.transport_from_previous.avoid,
			startTime: itineraryItem.transport_from_previous.start_time,
			duration: itineraryItem.transport_from_previous.duration,
			note: itineraryItem.transport_from_previous.note,
			waypoints: itineraryItem.transport_from_previous.waypoints.map((waypoint) => ({
				location: waypoint as Location
			}))
		} : null
	} as ItineraryItem))
} as Day));

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

export const mapTripToApiResponse = (trip: Trip): object => {
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
		days: trip.days && trip.days.map((day: Day) => ({
				note: day.note,
				itinerary: day.itinerary.map((itineraryItem: ItineraryItem) => ({
					place_id: itineraryItem.placeId,
					start_time: itineraryItem.startTime,
					duration: itineraryItem.duration,
					note: itineraryItem.note,
					transport_from_previous: itineraryItem.transportFromPrevious ? {
						mode: itineraryItem.transportFromPrevious.mode,
						type: itineraryItem.transportFromPrevious.type,
						avoid: itineraryItem.transportFromPrevious.avoid,
						start_time: itineraryItem.transportFromPrevious.startTime,
						duration: itineraryItem.transportFromPrevious.duration,
						note: itineraryItem.transportFromPrevious.note,
						waypoints: itineraryItem.transportFromPrevious.waypoints
					} : null
				}))
			})
		)
	};
};
