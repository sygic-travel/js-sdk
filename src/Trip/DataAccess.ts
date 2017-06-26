import { camelizeKeys } from 'humps';
import * as cloneDeep from 'lodash.clonedeep';
import { stringify } from 'query-string';

import { tripsDetailedCache as tripsDetailedCache } from '../Cache';
import { getTripConflictHandler } from '../Settings';
import { getUserSettings } from '../User';
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

const updateTimeouts = {};
const tripDataToSend = {};
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

	return mapTripDetailedApiResponseToTrip(result, await getUserSettings());
}

export async function createTrip(tripRequest: TripCreateRequest): Promise<Trip> {
	const apiResponse: ApiResponse = await post('trips', mapTripCreateRequestToApiFormat(tripRequest));
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	const tripData = apiResponse.data.trip;
	await tripsDetailedCache.set(tripData.id, tripData);
	return mapTripDetailedApiResponseToTrip(tripData, await getUserSettings());
}

export async function updateTrip(tripToBeUpdated: Trip): Promise<Trip> {
	const tripApiFormatData = mapTripToApiFormat(tripToBeUpdated);
	await tripsDetailedCache.set(tripToBeUpdated.id, tripApiFormatData);
	if (updateTimeouts[tripToBeUpdated.id]) {
		clearTimeout(updateTimeouts[tripToBeUpdated.id]);
	}
	const updateRequestData = mapTripToApiUpdateFormat(tripToBeUpdated) as any;
	updateRequestData.updated_at = dateToW3CString(new Date());
	tripDataToSend[tripToBeUpdated.id] = updateRequestData;
	updateTimeouts[tripToBeUpdated.id] = setTimeout(async () => {
		const requestData =  cloneDeep(tripDataToSend[tripToBeUpdated.id]);
		delete tripDataToSend[tripToBeUpdated.id];
		const tripResponse: ApiResponse = await putTripToApi(requestData);
		if (tripResponse.data.conflict_resolution === 'ignored') {
			const conflictInfo = camelizeKeys(tripResponse.data.conflict_info) as TripConflictInfo;
			return await handleIgnoredConflict(conflictInfo, tripToBeUpdated, tripResponse);
		}
		if (tripDataToSend[tripToBeUpdated.id]) {
			tripDataToSend[tripToBeUpdated.id].base_version = tripResponse.data.trip.version;
		} else {
			await tripsDetailedCache.set(tripResponse.data.trip.id, tripResponse.data.trip);
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
	return tripResponse;
}

async function handleIgnoredConflict(
	conflictInfo: TripConflictInfo,
	tripToBeUpdated: Trip,
	tripServerResponse: ApiResponse
): Promise<void> {
	const conflictHandler = getTripConflictHandler();
	if (!conflictHandler) {
		await tripsDetailedCache.set(tripServerResponse.data.trip.id, tripServerResponse.data.trip);
		return;
	}
	const clientConflictResolution: TripConflictClientResolution = await conflictHandler(conflictInfo, tripToBeUpdated);
	if (clientConflictResolution === 'local') {
		const updateRequestData = mapTripToApiUpdateFormat(tripToBeUpdated) as any;
		updateRequestData.updated_at = dateToW3CString(new Date());
		tripServerResponse = await putTripToApi(updateRequestData);
	}
	await tripsDetailedCache.set(tripServerResponse.data.trip.id, tripServerResponse.data.trip);
}
