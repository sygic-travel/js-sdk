import { TripConflictHandler } from '../Trip';
import { Settings } from './Settings';

export { Settings } from './Settings';

let stApiUrl: string;
let ssoApiUrl: string;
let ssoClientId: string;
let integratorApiKey: string;

let tripConflictHandler: null | TripConflictHandler;
let apiKey: string | null;
let accessToken: string | null;

export function setEnvironment(settings: Settings): void {
	if (settings.stApiUrl) {
		stApiUrl = settings.stApiUrl;
	}
	if (settings.ssoApiUrl) {
		ssoApiUrl = settings.ssoApiUrl;
	}
	if (settings.ssoClientId) {
		ssoClientId = settings.ssoClientId;
	}
	if (settings.integratorApiKey) {
		integratorApiKey = settings.integratorApiKey;
	}
}

export function setUserSession(key: string | null, token: string | null): void {
	if (key && token) {
		throw Error('Can\'t set session with both key and token.');
	} else {
		apiKey = key;
		accessToken = token;
	}
}

export function getStApiUrl() {
	return stApiUrl;
}

export function getSsoApiUrl() {
	return ssoApiUrl;
}

export function getSsoClientId() {
	return ssoClientId;
}

export function getIntegratorKey() {
	return integratorApiKey;
}

export function setTripConflictHandler(handler: null | TripConflictHandler) {
	tripConflictHandler = handler;
}

export function getTripConflictHandler(): null | TripConflictHandler {
	return tripConflictHandler;
}
