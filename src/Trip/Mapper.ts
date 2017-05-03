import { camelizeKeys } from 'humps';

import { ApiResponse } from '../Xhr/ApiResponse';
import { Day, ItineraryItem, Trip, TripMedia } from './Trip';

export const mapTripListApiResponseToTripsList = (apiResponse: ApiResponse): Trip[] => {
	return apiResponse.data.trips.map((trip) => {
		return mapTrip(trip, null);
	});
};

export const mapTripDetailedApiResponseToTrip = (apiResponse: ApiResponse): Trip => {
	return mapTrip(apiResponse.data.trip, mapTripDays(apiResponse.data.trip));
};

export const mapTrip = (trip, days: Day[] | null): Trip => {
	return {
		id: trip.id,
		name: trip.name,
		version: trip.version,
		startsOn: trip.starts_on,
		endsOn: trip.ends_on,
		url: trip.url,
		days,
		media: camelizeKeys(trip.media) as TripMedia
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
