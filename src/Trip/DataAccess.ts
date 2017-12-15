import { camelizeKeys } from 'humps';
import { stringify } from 'query-string';

import { ApiResponse, StApi } from '../Api';
import { tripsDetailedCache as tripsDetailedCache } from '../Cache';
import { getTripConflictHandler } from '../Settings';
import { getUserSettings, UserSettings } from '../User';
import { dateToW3CString } from '../Util';
import {
	mapTripCreateRequestToApiFormat,
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	mapTripTemplateApiResponse,
	mapTripToApiFormat,
	mapTripToApiUpdateFormat
} from './Mapper';
import { Trip, TripConflictClientResolution, TripConflictInfo, TripCreateRequest, TripTemplate } from './Trip';

interface ChangedTrip {
	trip: Trip;
	apiData: any;
	timeout;
}

const changedTrips: Map<string, ChangedTrip> = new Map();
const UPDATE_TIMEOUT: number = 3000;

export async function getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<Trip[]> {
	const query: any = {};
	if (dateFrom !== null) {
		query.from = dateFrom;
	}
	if (dateTo !== null) {
		query.to = dateTo;
	}
	const apiResponse = await StApi.get('trips/list?' + stringify(query));

	if (!apiResponse.data.hasOwnProperty('trips')) {
		throw new Error('Wrong API response');
	}

	return mapTripListApiResponseToTripsList(apiResponse.data.trips);
}

export async function getTripsInTrash(): Promise<Trip[]> {
	const apiResponse = await StApi.get('trips/trash');

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
	const apiResponse: ApiResponse = await StApi.post('trips', mapTripCreateRequestToApiFormat(tripRequest));
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
	const oldChangedTrip: ChangedTrip | undefined = changedTrips.get(tripToBeUpdated.id);
	if (oldChangedTrip) {
		clearTimeout(oldChangedTrip.timeout);
	}
	const updateRequestData = mapTripToApiUpdateFormat(tripToBeUpdated) as any;
	updateRequestData.updated_at = dateToW3CString(new Date());
	const changedTrip: ChangedTrip = {
		apiData: updateRequestData,
		trip: tripToBeUpdated,
		timeout: setTimeout(async () => {
			await syncChangedTripToServer(tripToBeUpdated.id);
		}, UPDATE_TIMEOUT)
	};
	changedTrips.set(tripToBeUpdated.id, changedTrip);
	return tripToBeUpdated;
}

export async function syncChangedTripToServer(tripId: string): Promise<void> {
	const changedTrip: ChangedTrip | undefined = changedTrips.get(tripId);
	changedTrips.delete(tripId);
	if (!changedTrip)  {
		return;
	}
	const tripResponse: ApiResponse = await putTripToApi(changedTrip.apiData);
	clearTimeout(changedTrip.timeout);
	if (tripResponse.data.conflict_resolution === 'ignored') {
		const conflictInfo = camelizeKeys(tripResponse.data.conflict_info) as TripConflictInfo;
		return handleIgnoredConflict(conflictInfo, changedTrip.trip, tripResponse);
	}

	const newerChangedTrip: ChangedTrip | undefined = changedTrips.get(tripId);
	if (newerChangedTrip) {
		newerChangedTrip.apiData.base_version = tripResponse.data.trip.version;
	} else {
		await tripsDetailedCache.set(tripResponse.data.trip.id, tripResponse.data.trip);
	}
}

export async function shouldNotifyOnTripUpdate(id: string, version: number | null): Promise<boolean> {
	const cachedTrip = await tripsDetailedCache.get(id);
	if (cachedTrip && cachedTrip.version === version) {
		return false;
	}
	if (cachedTrip) {
		await getTripFromApi(id);
	}
	return true;
}

export async function isTripInCache(id: string): Promise<boolean> {
	return !!await tripsDetailedCache.get(id);
}

export async function deleteTripFromCache(id: string): Promise<void> {
	return tripsDetailedCache.remove(id);
}

export async function cloneTrip(id: string): Promise<string> {
	const clone: ApiResponse = await StApi.post('trips/clone', { trip_id: id });
	if (!clone.data.hasOwnProperty('trip_id')) {
		throw new Error('Wrong API response');
	}
	return clone.data.trip_id;
}

async function getTripFromApi(id: string): Promise<object> {
	const apiResponse = await StApi.get('trips/' + id);
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	await tripsDetailedCache.set(id, apiResponse.data.trip);
	return apiResponse.data.trip;
}

async function putTripToApi(requestData): Promise<ApiResponse> {
	const tripResponse: ApiResponse = await StApi.put(
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

export async function emptyTripsTrash(): Promise<string[]> {
	const apiResponse = await StApi.delete_('trips/trash', null);
	if (!apiResponse.data.hasOwnProperty('deleted_trip_ids')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.deleted_trip_ids as string[];
}

export async function getTripTemplates(placeId: string): Promise<TripTemplate[]> {
	const apiResponse: ApiResponse = await StApi.get(`trip-templates?${stringify({
		place_id: placeId
	})}`);
	if (!apiResponse.data.hasOwnProperty('trip_templates')) {
		throw new Error('Wrong API response');
	}

	const userSettings: UserSettings = await getUserSettings();
	return apiResponse.data.trip_templates.map((tripTemplate: any): TripTemplate => (
		mapTripTemplateApiResponse(tripTemplate, userSettings)
	));
}

export async function applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trip> {
	const apiResponse: ApiResponse = await StApi.put(`/trips/${tripId}/apply-template`, {
		template_id: templateId,
		day_index: dayIndex
	});
	if (!apiResponse.data.hasOwnProperty('trip')) {
		throw new Error('Wrong API response');
	}
	await tripsDetailedCache.set(apiResponse.data.trip.id, apiResponse.data.trip);
	return mapTripDetailedApiResponseToTrip(apiResponse.data.trip, await getUserSettings());
}
