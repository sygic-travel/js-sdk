import { Location } from '../Geo';
import { Place } from '../Places';
import { listToEnum } from '../Util';

const transportModeValues = listToEnum([
	'car',
	'pedestrian',
	'bike',
	'plane',
	'bus',
	'train',
	'boat'
]);
export function isTransportMode(val: any): val is TransportMode {
	return typeof val === 'string' && transportModeValues[val] === val;
}
export type TransportMode = keyof typeof transportModeValues;

const transportTypeValues = listToEnum([
	'fastest',
	'shortest',
	'economic'
]);
export type TransportType = keyof typeof transportTypeValues;

export function isTransportType(val: any): val is TransportType {
	return typeof val === 'string' && transportTypeValues[val] === val;
}

const transportAvoidValues = listToEnum([
	'tolls',
	'highway',
	'ferries',
	'unpaved'
]);

export type TransportAvoid = keyof typeof transportAvoidValues;

export function isTransportAvoid(val: any): val is TransportAvoid {
	return typeof val === 'string' && transportAvoidValues[val] === val;
}

export interface Trip {
	id: string;
	ownerId: string;
	privacyLevel: string;
	name: string | null;
	version: number;
	startsOn: string | null;
	updatedAt: string;
	isDeleted: boolean;
	endsOn: string | null;
	url: string;
	days: Day[] | null;
	media: TripMedia;
	privileges: TripPrivileges;
}

export interface TripCreateRequest {
	name: string | null;
	startsOn: string;
	days: Day[];
	privacyLevel: string;
	endsOn: string;
	isDeleted: boolean;
}

export interface TripMedia {
	square: {
		id: string;
		urlTemplate: string;
	} | null;
	landscape: {
		id: string;
		urlTemplate: string;
	} | null;
	portrait: {
		id: string;
		urlTemplate: string;
	} | null;
	videoPreview: {
		id: string;
		urlTemplate: string;
	} | null;
}

export interface Day {
	note: string | null;
	itinerary: ItineraryItem[];
	date: string | null;
}

export interface ItineraryItem {
	place: Place | null;
	placeId: string;
	startTime: number | null; // Number of seconds from midnight.
	duration: number | null; // Time in seconds planned to spend visiting place.
	note: string | null;
	isSticky: boolean | null; // https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
	transportFromPrevious: TransportSettings | null;

}

export interface TransportSettings {
	mode: TransportMode;
	type: TransportType;
	avoid: TransportAvoid[];
	startTime: number | null; // Number of seconds from midnight.
	duration: number | null; // Time in seconds spent on the transport.
	note: string | null;
	waypoints: Location[];
}

export interface TripPrivileges {
	edit: boolean;
	manage: boolean;
	delete: boolean;
}

export interface TripUpdateData {
	name?: string;
	startsOn?: string;
	privacyLevel?: string;
	isDeleted?: boolean;
}
