import { stringify } from 'query-string';

import { tripsDetailedCache as tripsDetailedCache } from '../Cache';
import { ApiResponse, get, post } from '../Xhr';
import {
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	mapTripToApiResponse
} from './Mapper';
import {Trip } from './Trip';

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	const apiResponse = await get('trips/list?' + stringify({
		from: dateFrom,
		to: dateTo
	}));

	if (!apiResponse.data.hasOwnProperty('trips')) {
		throw new Error('Wrong API response');
	}

	return mapTripListApiResponseToTripsList(apiResponse.data.trips);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	let result: any = null;
	const fromCache: any = await tripsDetailedCache.get(id);

	if (!fromCache) {
		result = await getTripFromApi(id);
		tripsDetailedCache.set(id, result);
	} else {
		result = fromCache;
	}

	return mapTripDetailedApiResponseToTrip(result);
}

export async function updateTrip(tripToBeUpdated: Trip): Promise<Trip> {
	const tripRequestData = mapTripToApiResponse(tripToBeUpdated);
	await tripsDetailedCache.set(tripToBeUpdated.id, tripRequestData);
	// save to api somewhere here
	return tripToBeUpdated;
}

export async function handleTripChangeNotification(id: string): Promise<void> {
	const cachedTrip = await tripsDetailedCache.get(id);
	if (cachedTrip) {
		await getTripFromApi(id);
	}
}

export async function deleteTripFromCache(id: string): Promise<void> {
	return tripsDetailedCache.remove(id);
}

export async function cloneTrip(id: string): Promise<string> {
	const clone: ApiResponse = await post('trips/clone', { trip_id: id });
	if (!clone.data.hasOwnProperty('trip_id')) {
		throw new Error('Wrong API response');
	}
	return clone.data.trip_id;
}

async function getTripFromApi(id: string): Promise<object> {
	const apiResponse = await get('trips/' + id);
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	await tripsDetailedCache.set(id, apiResponse.data.trip);
	return apiResponse.data.trip;
}
