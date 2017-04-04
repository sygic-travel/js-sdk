import { Media } from '../Media/Media';
import { get } from '../Xhr';
import { PlacesFilter } from './Filter';
import { Place } from './Place';
import { PlaceDetailed, PlaceDetailedResponse } from './PlaceDetailed';

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	const apiResponse = await get('places' + '?' + filter.toQueryString());
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.places.map((place) => place as Place);
}

export async function getPlaceDetailed(guid: string, photoSize: string): Promise<PlaceDetailed> {
	const apiResponse = await get('place-details/' + guid);
	if (!apiResponse.data.hasOwnProperty('place')) {
		throw new Error('Wrong API response');
	}

	return new PlaceDetailed(apiResponse.data.place as PlaceDetailedResponse, photoSize);
}

export async function getPlaceMedia(guid: string): Promise<Media[]> {
	const apiResponse = await get('places/' + guid + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}

	return apiResponse.data.media.map((media) => media as Media);
}

export function dummyFunction() {
	return 'dummy';
}
