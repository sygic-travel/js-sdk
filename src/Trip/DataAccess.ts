import { camelizeKeys } from 'humps';
import { stringify } from 'query-string';

import { tripsDetailedCache as tripsDetailedCache } from '../Cache';
import { getTripConflictHandler } from '../Settings';
import { dateToW3CString } from '../Util';
import { ApiResponse, get, post, put } from '../Xhr';
import {
	mapTripCreateRequestToApiFormat,
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	mapTripToApiFormat,
	mapTripToApiUpdateFormat
} from './Mapper';
import { Trip, TripConflictClientResolution, TripConflictInfo, TripCreateRequest } from './Trip';

let updateTimeout;
const UPDATE_TIMEOUT: number = 3000;

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

export async function createTrip(tripRequest: TripCreateRequest): Promise<Trip> {
	const apiResponse: ApiResponse = await post('trips', mapTripCreateRequestToApiFormat(tripRequest));
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	const tripData = apiResponse.data.trip;
	await tripsDetailedCache.set(tripData.id, tripData);
	return mapTripDetailedApiResponseToTrip(tripData);
}

export async function updateTrip(tripToBeUpdated: Trip): Promise<Trip> {
	const tripApiFormatData = mapTripToApiFormat(tripToBeUpdated);
	await tripsDetailedCache.set(tripToBeUpdated.id, tripApiFormatData);
	if (updateTimeout) {
		clearTimeout(updateTimeout);
	}
	const updateRequestData = mapTripToApiUpdateFormat(tripToBeUpdated) as any;
	updateRequestData.updated_at = dateToW3CString(new Date());
	updateTimeout = setTimeout(async () => {
		const tripResponse: ApiResponse = await putTripToApi(updateRequestData);
		if (tripResponse.data.conflict_resolution === 'ignored') {
			const conflictInfo = camelizeKeys(tripResponse.data.conflict_info) as TripConflictInfo;
			await handleIgnoredConflict(conflictInfo, tripToBeUpdated);
		}
	}, UPDATE_TIMEOUT);
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

async function putTripToApi(requestData): Promise<ApiResponse> {
	const tripResponse: ApiResponse = await put(
		'trips/' + requestData.id,
		requestData
	);
	if (!tripResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	await tripsDetailedCache.set(tripResponse.data.trip.id, tripResponse.data.trip);
	return tripResponse;
}

async function handleIgnoredConflict(
	conflictInfo: TripConflictInfo,
	tripToBeUpdated: Trip
): Promise<void> {
	const conflictHandler = getTripConflictHandler();
	if (!conflictHandler) {
		return;
	}
	const clientConflictResolution: TripConflictClientResolution = await conflictHandler(conflictInfo, tripToBeUpdated);
	if (clientConflictResolution === 'local') {
		const updateRequestData = mapTripToApiUpdateFormat(tripToBeUpdated) as any;
		updateRequestData.updated_at = dateToW3CString(new Date());
		await putTripToApi(updateRequestData);
	}
}
