import { decamelizeKeys } from 'humps';
import { stringify } from 'query-string';

import { ApiResponse } from '../Api';
import * as StApi from '../Api/StApi';
import { Location } from '../Geo';
import { License } from '../Media';
import { mapPlaceDetailedApiResponseToPlace } from '../Places/Mapper';
import { Event, EventsQuery, EventType, PlaceEvents } from './Event';
import { mapEventApiResponseToEvent } from './Mapper';

export const createPlace = (location: Location, note: string | null): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.CREATE_PLACE,
	suggested: {
		location: {
			lat: location.lat,
			lng: location.lng
		}
	},
	note
});

export const updatePlaceAddress = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_ADDRESS,
	place_id: placeId,
	original,
	suggested,
	note
});

export const updatePlaceAdmission = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_ADMISSION,
	place_id: placeId,
	original,
	suggested,
	note
});

export const updatePlaceEmail = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_EMAIL,
	place_id: placeId,
	original,
	suggested,
	note
});

export const updatePlaceLocation = (
	placeId: string,
	original: Location,
	suggested: Location,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_LOCATION,
	place_id: placeId,
	original: {
		lat: original.lat,
		lng: original.lng
	},
	suggested: {
		lat: suggested.lat,
		lng: suggested.lng
	},
	note
});

export const updatePlaceName = (
	placeId: string,
	languageId: string | null,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_NAME,
	place_id: placeId,
	language_id: languageId,
	original,
	suggested,
	note
});

export const updatePlaceOpeningHours = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_OPENING_HOURS,
	place_id: placeId,
	original,
	suggested,
	note
});

export const updatePlaceOpeningHoursNote = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_OPENING_HOURS_NOTE,
	place_id: placeId,
	original,
	suggested,
	note
});

export const updatePlacePhone = (
	placeId: string,
	original: string | null,
	suggested: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_PHONE,
	place_id: placeId,
	original,
	suggested,
	note
});

export const createPlaceReference = (
	placeId: string,
	languageId: string | null,
	suggestedType: string,
	suggestedUrl: string,
	note: string | null
) => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_REFERENCES,
	place_id: placeId,
	language_id: languageId,
	original: {
		url: null
	},
	suggested: {
		type: suggestedType,
		url: suggestedUrl
	},
	note
});

export const updatePlaceReference = (
	placeId: string,
	languageId: string | null,
	originalUrl: string ,
	originalType: string,
	suggestedUrl: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.UPDATE_PLACE_REFERENCES,
	place_id: placeId,
	language_id: languageId,
	original: {
		url: originalUrl
	},
	suggested: {
		type: originalType,
		url: suggestedUrl
	},
	note
});

export const createPlaceTag = (
	placeId: string,
	key: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.CREATE_PLACE_TAG,
	place_id: placeId,
	suggested: {
		key
	},
	note
});

export const deletePlaceTag = (
	placeId: string,
	key: string,
	note: string | null
): Promise<string> => callCrowdsourcingApiEndpoint({
	type: EventType.DELETE_PLACE_TAG,
	place_id: placeId,
	suggested: {
		key
	},
	note
});

const callCrowdsourcingApiEndpoint = async (requestData: any): Promise<string> => {
	const apiResponse: ApiResponse = await StApi.post(`crowdsourcing`, requestData);
	if (!apiResponse.data.hasOwnProperty('place_id')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.place_id as string;
};

export const createPlaceMedia = async (
	placeId: string,
	imageData: string,
	imageMimeType: string,
	license: License,
	note: string | null
): Promise<string> => {
	const apiResponse: ApiResponse = await StApi.postMultipartJsonImage(
		`crowdsourcing/media`,
		{
			type: EventType.CREATE_PLACE_MEDIA,
			place_id: placeId,
			original: null,
			suggested: {
				type: 'photo',
				license
			},
			note
		},
		imageMimeType,
		imageData
	);
	if (!apiResponse.data.hasOwnProperty('place_id')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.place_id as string;
};

export const getEvents = async (filter?: EventsQuery): Promise<Event[]> => {
	const queryString: string = filter ? 'crowdsourcing?' + stringify(decamelizeKeys(filter)) : 'crowdsourcing';
	const apiResponse: ApiResponse = await StApi.get(queryString);
	if (!apiResponse.data.hasOwnProperty('events')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.events.map((event: any) => mapEventApiResponseToEvent(event));
};

enum ModerationState {
	'accepted',
	'rejected'
}

export const moderateEvents = async (eventIds: number[], state: ModerationState): Promise<void> => {
	await StApi.put('crowdsourcing/moderation', eventIds.map((eventId) => ({
		id: eventId,
		state
	})));
};

export const assignNextEvents = async (limit: number): Promise<PlaceEvents[]> => {
	const queryString: string = limit ? `crowdsourcing/assign-next?limit=${limit}` : `crowdsourcing/assign-next`;
	const apiResponse: ApiResponse = await StApi.get(queryString);
	if (!Array.isArray(apiResponse.data)) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.map((placeEvents: any) => {
		return {
			events: placeEvents.events.map((event: any) => mapEventApiResponseToEvent(event)),
			place: mapPlaceDetailedApiResponseToPlace(placeEvents.place, '100x100')
		}
	});
};
