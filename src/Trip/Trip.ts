import { Place } from '../Places';
import { Waypoint } from '../Route';
import { UserSettings } from '../User';

export const UNBREAKABLE_TRANSPORT_MODES = ['plane', 'bus', 'train', 'boat'];

export enum TransportMode {
	car = 'car',
	pedestrian = 'pedestrian',
	bike = 'bike',
	plane = 'plane',
	bus = 'bus',
	train = 'train',
	boat = 'boat'
}

export function isTransportMode(mode: string): boolean {
	return !!TransportMode[mode];
}

export enum TransportAvoid {
	tolls = 'tolls',
	highways = 'highways',
	ferries = 'ferries',
	unpaved = 'unpaved'
}

export function isTransportAvoid(avoid: string): boolean {
	return !!TransportAvoid[avoid];
}

export enum TripConflictResolution {
	merged = 'merged',
	duplicated = 'duplicated',
	ignored = 'ignored',
	overridden = 'overridden'
}

export function isTripConflictResolution(resolution: string): boolean {
	return !!TripConflictResolution[resolution];
}

export enum TripConflictClientResolution {
	server  = 'server',
	local = 'local'
}

export function isTripConflictClientResolution(resolution: string): boolean {
	return !!TripConflictClientResolution[resolution];
}

export interface TripConflictInfo {
	lastUserName: string;
	lastUpdatedAt: string;
}

export type TripConflictHandler = (conflictInfo: TripConflictInfo, trip: Trip) => Promise<TripConflictClientResolution>;

export interface TripInfo {
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
	media: TripMedia;
	privileges: TripPrivileges;
}

export interface Trip extends TripInfo {
	days: Day[];
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
	isStickyFirstInDay: boolean | null;
	isStickyLastInDay?: boolean | null;
	transportFromPrevious: TransportSettings | null;

}

export interface TransportSettings {
	mode: TransportMode;
	avoid: TransportAvoid[];
	startTime: number | null; // Number of seconds from midnight.
	duration: number | null; // Time in seconds spent on the transport.
	note: string | null;
	waypoints: Waypoint[];
	routeId: string | null;
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

export interface TripTemplate {
	id: number;
	description: string;
	duration: number | null;
	trip: Trip;
}

export interface TripEditor {
	addDaysToTrip(
		trip: Trip,
		appendCount: number,
		prependCount: number,
		userSettings: UserSettings | null
	): Trip;
	removeDay(trip: Trip, dayIndex: number, userSettings: UserSettings | null): Trip;
	swapDaysInTrip(
		trip: Trip,
		firstDayIndex: number,
		secondDayIndex: number,
		userSettings: UserSettings | null
	): Trip;
	addPlaceToDay(
		trip: Trip,
		place: Place,
		dayIndex: number,
		userSettings: UserSettings | null,
		positionInDay?: number // If not passed the place is added to the end
	): Trip;
	duplicatePlace(
		trip: Trip,
		dayIndex: number,
		placeIndex: number,
		resetTransport: boolean,
		userSettings: UserSettings | null
	): Trip;
	movePlaceInDay(
		trip: Trip,
		dayIndex: number,
		positionFrom: number,
		positionTo: number,
		userSettings: UserSettings | null
	): Trip;
	removePlacesFromDay(
		trip: Trip,
		dayIndex: number,
		positionsInDay: number[],
		userSettings: UserSettings | null
	): Trip;
	removeAllPlacesFromDay(
		tripToBeUpdated: Trip,
		dayIndex: number,
		userSettings: UserSettings | null
	): Trip;
	addOrReplaceOvernightPlace(
		trip: Trip,
		place: Place,
		dayIndex: number,
		userSettings: UserSettings | null
	): Trip;
	removePlaceFromDaysByPlaceId(
		trip: Trip,
		placeId: string,
		dayIndexes: number[],
		userSettings: UserSettings | null
	): Trip;
	setTransport(
		trip: Trip,
		dayIndex: number,
		itemIndex: number,
		settings: TransportSettings | null
	): Trip;
	updatePlaceUserData(
		trip: Trip,
		dayIndex: number,
		itemIndex: number,
		startTime: number | null,
		duration: number | null,
		note: string | null
	): Trip;
	updateDayNote(trip: Trip, dayIndex: number, note: string): Trip;
	smartAddPlaceToDay(
		trip: Trip,
		placeId: string,
		dayIndex: number,
		positionInDay?: number // If not passed automatic algorithm is used
	): Promise<Trip>;
	smartAddSequenceToDay(
		trip: Trip,
		dayIndex: number,
		placeIds: string[],
		transports?: (TransportSettings | null)[],
		positionInDay?: number // If not passed automatic algorithm is used
	): Promise<Trip>;
	createTrip(startDate: string, name: string, daysCount: number, placeId?: string): Promise<Trip>;
	setStartDate(trip: Trip, startDate: string): Trip;
}
