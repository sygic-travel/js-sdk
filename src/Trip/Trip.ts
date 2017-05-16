import { Location } from '../Geo';
import { Place } from '../Places';

type TransportMode =
	'car' |
	'pedestrian' |
	'bike' |
	'plane' |
	'bus' |
	'train' |
	'boat';

type TransportType =
	'fastest' |
	'shortest' |
	'economic';

type TransportAvoid =
	'tolls' |
	'highway' |
	'ferries' |
	'unpaved';

export interface Trip {
	id: string;
	name: string | null;
	version: number;
	startsOn: string | null;
	endsOn: string | null;
	url: string;
	days: Day[] | null;
	media: TripMedia;
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
}

export interface ItineraryItem {
	place: Place | null;
	placeId: string;
	startTime: number | null; // Number of seconds from midnight.
	duration: number | null; // Time in seconds planned to spend visiting place.
	note: string | null;
	transportFromPrevious: {
		mode: TransportMode,
		type: TransportType,
		avoid: TransportAvoid[]
		startTime: number | null // Number of seconds from midnight.
		duration: number | null // Time in seconds spent on the transport.
		note: string | null
		waypoints: Location[]
	} | null;

}
