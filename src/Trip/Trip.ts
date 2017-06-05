import { Location } from '../Geo';
import { Place } from '../Places';

export type TransportMode =
	'car' |
	'pedestrian' |
	'bike' |
	'plane' |
	'bus' |
	'train' |
	'boat';

export type TransportType =
	'fastest' |
	'shortest' |
	'economic';

export type TransportAvoid =
	'tolls' |
	'highway' |
	'ferries' |
	'unpaved';

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
}
