import { ApiResponse } from '../Api';
import * as StApi from '../Api/StApi';
import { Location } from '../Geo';
import { License } from '../Media';

export enum UpdatableReferenceType {
	'article:blog', 'link:facebook', 'link:google_plus', 'link:info', 'link:instagram', 'link:official', 'link:program',
	'link:timetable', 'link:twitter', 'link:webcam', 'link:youtube', 'map:subway', 'map:visitor', 'wiki'
}

export const createPlace = (location: Location, note: string | null): Promise<string> => callCrowdsourcingApiEndpoint({
	type: 'place:create',
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
	type: 'place:update:address',
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
	type: 'place:update:admission',
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
	type: 'place:update:email',
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
	type: 'place:update:location',
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
	type: 'place:update:name',
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
	type: 'place:update:opening_hours',
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
	type: 'place:update:opening_hours_note',
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
	type: 'place:update:phone',
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
	type: 'place:update:references',
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
	type: 'place:update:references',
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
	type: 'place.tag:create',
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
	type: 'place.tag:delete',
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
			type: 'place.media:create',
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
