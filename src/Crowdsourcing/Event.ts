import { Location } from '../Geo';
import { License } from '../Media';
import { Place } from '../Places';

export enum UpdatableReferenceType {
	'article:blog', 'link:facebook', 'link:google_plus', 'link:info', 'link:instagram', 'link:official', 'link:program',
	'link:timetable', 'link:twitter', 'link:webcam', 'link:youtube', 'map:subway', 'map:visitor', 'wiki'
}

export enum EventType {
	CREATE_PLACE = 'place:create',
	CREATE_PLACE_MEDIA = 'place.media:create',
	CREATE_PLACE_TAG = 'place.tag:create',
	DELETE_PLACE_TAG = 'place.tag:delete',
	DELETE_PLACE_ADDRESS = 'place:delete:address',
	DELETE_PLACE_ADMISSION = 'place:delete:admission',
	DELETE_PLACE_ATTRIBUTE = 'place:delete:attributes',
	DELETE_PLACE_EMAIL = 'place:delete:email',
	DELETE_PLACE_NAME = 'place:delete:name',
	DELETE_PLACE_OPENING_HOURS = 'place:delete:opening_hours',
	DELETE_PLACE_OPENING_HOURS_NOTE = 'place:delete:opening_hours_note',
	DELETE_PLACE_PHONE = 'place:delete:phone',
	DELETE_PLACE_REFERENCES = 'place:delete:references',
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
	EventDataGenericDelete |
	EventDataName |
	EventDataNameDelete |
	EventDataAttributes |
	EventDataAttributesDelete |
	EventDataReferences |
	EventDataReferencesDelete |
	EventDataPlaceMedia |
	EventDataLocation |
	EventDataTag;

export interface EventDataGeneric {
	type: EventType.UPDATE_PLACE_ADDRESS |
		EventType.UPDATE_PLACE_ADMISSION |
		EventType.UPDATE_PLACE_EMAIL |
		EventType.UPDATE_PLACE_OPENING_HOURS |
		EventType.UPDATE_PLACE_OPENING_HOURS_NOTE |
		EventType.UPDATE_PLACE_PHONE;
	placeId: string;
	original: string | null;
	suggested: string;
	note: string | null;
}

export interface EventDataGenericDelete {
	type: EventType.DELETE_PLACE_ADDRESS |
		EventType.DELETE_PLACE_ADMISSION |
		EventType.DELETE_PLACE_EMAIL |
		EventType.DELETE_PLACE_OPENING_HOURS |
		EventType.DELETE_PLACE_OPENING_HOURS_NOTE |
		EventType.DELETE_PLACE_PHONE;
	placeId: string;
	original: string;
	note: string | null;
}

export interface EventDataName {
	type: EventType.UPDATE_PLACE_NAME;
	placeId: string;
	languageId: string | null;
	original: string | null;
	suggested: string;
	note: string | null;
}

export interface EventDataNameDelete {
	type: EventType.DELETE_PLACE_NAME;
	placeId: string;
	languageId: string | null;
	original: string;
	note: string | null;
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
	suggested: {
		type: UpdatableReferenceType;
		url: string;
	};
	note: string | null;
}

export interface EventDataReferencesDelete {
	type: EventType.DELETE_PLACE_REFERENCES;
	placeId: string;
	languageId: string;
	original: {
		url: string;
		type: UpdatableReferenceType;
	};
	note: string | null;
}

export interface EventDataAttributes {
	type: EventType.UPDATE_PLACE_ATTRIBUTE;
	placeId: string;
	languageId: string;
	original: {
		value: string | null
	};
	suggested: {
		key: string;
		value: string;
	};
	note: string | null;
}

export interface EventDataAttributesDelete {
	type: EventType.DELETE_PLACE_ATTRIBUTE;
	placeId: string;
	languageId: string;
	original: {
		key: string;
		value: string;
	};
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
