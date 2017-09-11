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
	'highways',
	'ferries',
	'unpaved'
]);
export type TransportAvoid = keyof typeof transportAvoidValues;
export function isTransportAvoid(val: any): val is TransportAvoid {
	return typeof val === 'string' && transportAvoidValues[val] === val;
}

const conflictResolutionValues = listToEnum([
	'merged',
	'duplicated',
	'ignored',
	'overrode',
]);
export type TripConflictResolution = keyof typeof conflictResolutionValues;
export function isTripConflictResolution(val: any): val is TripConflictResolution {
	return typeof val === 'string' && conflictResolutionValues[val] === val;
}

const conflictClientResolutionValues = listToEnum([
	'server',
	'local',
]);
export type TripConflictClientResolution = keyof typeof conflictClientResolutionValues;
export function isTripConflictClientResolution(val: any): val is TripConflictClientResolution {
	return typeof val === 'string' && conflictClientResolutionValues[val] === val;
}

export interface TripConflictInfo {
	lastUserName: string;
	lastUpdatedAt: string;
}

export type TripConflictHandler = (conflictInfo: TripConflictInfo, trip: Trip) => Promise<TripConflictClientResolution>;

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

export function hasDayStickyPlaceFromBothSides(trip: Trip, dayIndex: number): boolean {
	if (dayIndex === 0 || (trip.days && dayIndex === trip.days.length - 1)) {
		return false;
	}

	if (!trip.days) {
		throw new Error('Trip is not fully loaded');
	}

	const itinerary: ItineraryItem[] = trip.days[dayIndex].itinerary;

	if (itinerary.length !== 1 || !itinerary[0].isSticky) {
		return false;
	}

	const nextItinerary: ItineraryItem[]  = trip.days[dayIndex + 1].itinerary;
	const previousItinerary: ItineraryItem[]  = trip.days[dayIndex - 1].itinerary;

	if (nextItinerary.length === 0 || previousItinerary.length === 0) {
		return false;
	}

	if (nextItinerary[0].placeId === itinerary[0].placeId &&
		previousItinerary[previousItinerary.length - 1].placeId === itinerary[0].placeId
	) {
		return true;
	}

	return false;
}

export interface TripTemplate {
	id: number;
	description: string;
	duration: number | null;
	trip: Trip;
}
