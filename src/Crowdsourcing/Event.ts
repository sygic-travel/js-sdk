import { Location } from '../Geo';
import { License } from '../Media';
import { Place } from '../Places';

export enum UpdatableReferenceType {
	'article:blog', 'link:facebook', 'link:google_plus', 'link:info', 'link:instagram', 'link:official', 'link:program',
	'link:timetable', 'link:twitter', 'link:webcam', 'link:youtube', 'map:subway', 'map:visitor', 'wiki'
}

export enum EventType {
	CREATE_PLACE = 'place:create',
	UPDATE_PLACE_ADDRESS = 'place:update:address',
	UPDATE_PLACE_ADMISSION = 'place:update:admission',
	UPDATE_PLACE_ATTRIBUTE = 'place:update:attributes',
	UPDATE_PLACE_EMAIL = 'place:update:email',
	UPDATE_PLACE_LOCATION = 'place:update:location',
	UPDATE_PLACE_NAME = 'place:update:name',
	UPDATE_PLACE_OPENING_HOURS = 'place:update:opening_hours',
	UPDATE_PLACE_OPENING_HOURS_NOTE = 'place:update:opening_hours_note',
	UPDATE_PLACE_PHONE = 'place:update:phone',
	UPDATE_PLACE_REFERENCES = 'place:update:references',
	CREATE_PLACE_TAG = 'place.tag:create',
	DELETE_PLACE_TAG = 'place.tag:delete',
	CREATE_PLACE_MEDIA = 'place.media:create'
}

export interface PlaceEvents {
	events: Event[],
	place: Place
}

export interface Event {
	id: number;
	createdAt: string;
	creatorId: string;
	creatorName: string;
	creatorEmail: string;
	moderatedAt: string | null;
	moderatedState: EventState;
	processedAt: string | null;
	data: EventData;
}

export type EventData = EventDataGeneric |
	EventDataWithLanguageId |
	EventDataReferences |
	EventDataPlaceMedia |
	EventDataLocation |
	EventDataTag;

export interface EventDataGeneric {
	type: EventType.UPDATE_PLACE_ADDRESS |
		EventType.UPDATE_PLACE_ADMISSION |
		EventType.UPDATE_PLACE_EMAIL |
		EventType.UPDATE_PLACE_NAME |
		EventType.UPDATE_PLACE_OPENING_HOURS |
		EventType.UPDATE_PLACE_OPENING_HOURS_NOTE |
		EventType.UPDATE_PLACE_PHONE;
	placeId: string;
	original: string | null;
	suggested: string;
	note: string | null;
}

export interface EventDataWithLanguageId extends EventDataGeneric {
	languageId: string | null;
}

export interface EventDataLocation {
	type: EventType.UPDATE_PLACE_LOCATION;
	placeId: string;
	original: Location;
	suggested: Location;
	note: string | null;
}

export interface EventDataReferences {
	type: EventType.UPDATE_PLACE_REFERENCES;
	placeId: string;
	languageId: string;
	original: {
		url: string | null
	};
	suggested: UpdatableReferenceType;
	note: string | null;
}

export interface EventDataPlaceMedia {
	type: EventType.CREATE_PLACE_MEDIA;
	placeId: string;
	original: null;
	suggested: {
		type: string;
		license: License;
		placePhotoId: number;
		location: Location;
	};
	note: string | null;
}

export interface EventDataTag {
	type: EventType.CREATE_PLACE_TAG | EventType.DELETE_PLACE_TAG;
	placeId: string;
	suggested: {
		key: string;
	};
	note: string | null;
}

export enum EventState {
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	UNMODERATED = 'unmoderated',
}

export interface EventsQuery {
	integratorId?: number;
	state?: EventState;
	placeId?: string;
	userId?: string;
	languageId?: string;
	limit?: number;
	offset?: number;
}
