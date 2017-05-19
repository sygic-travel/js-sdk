import { stringify } from 'query-string';

import { tripsDetailedCache as tripsDetailedCache } from '../Cache';
import { get } from '../Xhr';
import {
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	mapTripToApiResponse
} from './Mapper';
import { Trip } from './Trip';

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	const apiResponse = await get('trips/list?' + stringify({
		date_from: dateFrom,
		date_to: dateTo
	}));

	if (!apiResponse.data.hasOwnProperty('trips')) {
		throw new Error('Wrong API response');
	}

	return mapTripListApiResponseToTripsList(apiResponse.data.trips);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	let result: any = null;
	const fromCache: any = tripsDetailedCache.get(id);

	if (!fromCache) {
		const apiResponse = await get('trips/' + id);
		if (!apiResponse.data.hasOwnProperty('trip')) {
			throw new Error('Wrong API response');
		}

		result = apiResponse.data.trip;
		tripsDetailedCache.set(id, result);
	} else {
		result = fromCache;
	}

	return mapTripDetailedApiResponseToTrip(result);
}

export async function updateTrip(tripToBeUpdated: Trip): Promise<Trip> {
	const tripRequestData = mapTripToApiResponse(tripToBeUpdated);
	tripsDetailedCache.set(tripToBeUpdated.id, tripRequestData);
	// save to api somewhere here
	return tripToBeUpdated;
}
