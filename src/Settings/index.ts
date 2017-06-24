import { Trip, TripConflictClientResolution, TripConflictInfo } from '../Trip';

let apiUrl: string;
let clientKey: string;

let apiKey: string | null;
let accessToken: string | null;
let tripConflictHandler: null | ((conflictInfo: TripConflictInfo, trip: Trip) => Promise<TripConflictClientResolution>);

export function setEnvironment(url: string, key: string): void {
	apiUrl = url;
	clientKey = key;
}

export function setUserSession(key: string | null, token: string | null): void {
	if (key && token) {
		throw Error('Can\'t set session with both key and token.');
	} else {
		apiKey = key;
		accessToken = token;
	}
}

export function getApiUrl() {
	return apiUrl;
}

export function getClientKey() {
	return clientKey;
}

export function getApiKey() {
	return apiKey;
}

export function getAccessToken() {
	return accessToken;
}

export function setTripConflictHandler(
	handler: null | ((conflictInfo: TripConflictInfo, trip: Trip) => Promise<TripConflictClientResolution>)
) {
	tripConflictHandler = handler;
}

export function getTripConflictHandler(
): null | ((conflictInfo: TripConflictInfo, trip: Trip) => Promise<TripConflictClientResolution>) {
	return tripConflictHandler;
}
