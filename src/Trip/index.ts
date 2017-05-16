import { stringify } from 'query-string';

import { getPlaceDetailedBatch } from '../Places/index';
import { get } from '../Xhr';
import {
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	putPlacesToTrip
} from './Mapper';
import { Day, ItineraryItem, Trip } from './Trip';

export {
	Trip
};

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	const apiResponse = await get('trips/list?' + stringify({
		date_from: dateFrom,
		date_to: dateTo
	}));
	if (!apiResponse.data.hasOwnProperty('trips')) {
		throw new Error('Wrong API response');
	}
	return mapTripListApiResponseToTripsList(apiResponse);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const apiResponse = await get('trips/' + id);
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	const tripWithoutPlaces: Trip = mapTripDetailedApiResponseToTrip(apiResponse);

	if (tripWithoutPlaces.days) {
		return await addPlacesToTrip(tripWithoutPlaces);
	}

	return tripWithoutPlaces;
}

async function addPlacesToTrip(tripWithoutPlaces: Trip): Promise<Trip> {
	const placesGuids: string[] = getPlacesGuidsFromTrip(tripWithoutPlaces);
	return putPlacesToTrip(tripWithoutPlaces, await getPlaceDetailedBatch(placesGuids, '300x300'));
}

export function getPlacesGuidsFromTrip(trip: Trip): string[] {
	if (!trip.days) {
		return [];
	}

	const initAcc: string[] = [];
	return trip.days.reduce((acc, day: Day): string[] => ([
		...acc,
		...day.itinerary.map((itineraryItem: ItineraryItem): string => (itineraryItem.placeId))
	]), initAcc);
}
