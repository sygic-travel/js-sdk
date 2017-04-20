import * as api from '../Api';
import { Medium } from '../Media/Media';
import { get } from '../Xhr';
import { PlacesFilter } from './Filter';
import { mapPlaceApiResponseToPlaces, mapPlaceDetailedApiResponseToPlace } from './Mapper';
import { Place } from './Place';

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	const apiResponse = await api.getPlaces(filter);
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse);
}

export async function getPlaceDetailed(guid: string, photoSize: string): Promise<Place> {
	const apiResponse = await get('place-details/' + guid);
	if (!apiResponse.data.hasOwnProperty('place')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceDetailedApiResponseToPlace(apiResponse, photoSize);
}

export async function getPlaceMedia(guid: string): Promise<Medium[]> {
	const apiResponse = await get('places/' + guid + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media.map((media) => media as Medium);
}
