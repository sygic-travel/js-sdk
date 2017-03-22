import { get } from "../Xhr";
import PlacesFilter from './PlacesFilter';

interface Location {
	lat: number;
	lng: number;
}

export interface Place {
	guid: string;
	level: string;
	rating: number;
	quadkey: string;
	location: Location;
	bounding_box?: any;
	name: string;
	name_suffix: string;
	url: string;
	price?: any;
	marker: string;
	categories: string[];
	parent_guids: string[];
	perex: string;
	thumbnail_url: string;
}

export interface PlaceDetailed {

}

export interface Media {

}

function filterToQueryString(filter: PlacesFilter): string {
	let urlComponents: string[] = [];

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

export function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	return get('places' + filterToQueryString(filter))
		.then((apiResponse) => {
			if (!apiResponse.data.hasOwnProperty('places')) {
				throw 'Wrong API response'
			}
			return apiResponse.data.places.map((place) => place as Place);
		})
		.catch((e) => {
			console.error(e);
		})
}

export function getPlaceDetailed(guid: string): Promise<PlaceDetailed> {
	return get('place-details/' + guid)
		.then((apiResponse) => {
			if (!apiResponse.data.hasOwnProperty('place')) {
				throw 'Wrong API response'
			}
			return apiResponse.data.place as PlaceDetailed;
		})
		.catch((e) => {
			console.error(e);
		})
}

export function getPlaceMedia(guid: string): Promise<Media[]> {
	return get('places/' + guid + '/media')
		.then((apiResponse) => {
			if (!apiResponse.data.hasOwnProperty('media')) {
				throw 'Wrong API response'
			}

			return apiResponse.data.media.map((media) => media as Media);
		})
		.catch((e) => {
			console.error(e);
		})
}

export function dummyFunction() {
	console.log('Dummy');
}
