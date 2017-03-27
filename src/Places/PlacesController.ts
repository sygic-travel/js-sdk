import { get } from '../Xhr';
import { mapMainMediaToMedia } from '../Media/Mapper';
import {MainMedia, Media} from '../Media/Media';
import { Place } from './Place';
import {PlaceDetailed, PlaceDetailedWithMainMedia } from './PlaceDetailed';
import PlacesFilter from './PlacesFilter';

export function filterToQueryString(filter: PlacesFilter): string {
	const urlComponents: string[] = [];

	if (filter.query) {
		urlComponents.push('query=' + filter.query);
	}

	if (filter.mapTile) {
		urlComponents.push('map_tile=' + filter.mapTile);
	}

	if (filter.mapSpread) {
		urlComponents.push('map_spread=' + filter.mapSpread);
	}

	if (filter.categories && filter.categories.length > 0) {
		urlComponents.push('categories=' + filter.categories.join('|'));
	}

	if (filter.tags && filter.tags.length > 0) {
		urlComponents.push('tags=' + filter.tags.join('|'));
	}

	if (filter.parent) {
		urlComponents.push('parent=' + filter.parent);
	}

	if (filter.level) {
		urlComponents.push('level=' + filter.level);
	}

	if (filter.limit) {
		urlComponents.push('limit=' + filter.limit);
	}

	return '?' + urlComponents.join('&');
}

function mapPlaceDetailedWithMainMedia(placeDetailedWithMainMedia: PlaceDetailedWithMainMedia, photoSize: string): PlaceDetailed {
	const mainMedia: MainMedia = placeDetailedWithMainMedia.mainMedia;
	delete placeDetailedWithMainMedia.mainMedia;
	const placeDetailed: PlaceDetailed = placeDetailedWithMainMedia as PlaceDetailed;

	if (mainMedia) {
		placeDetailed.media = mapMainMediaToMedia(mainMedia, photoSize);
	}
	return placeDetailed;
}

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	const apiResponse = await get('places' + filterToQueryString(filter));
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
	return mapPlaceDetailedWithMainMedia(
		apiResponse.data.place as PlaceDetailedWithMainMedia,
		photoSize
	);
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
