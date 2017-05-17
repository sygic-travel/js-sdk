import { stringify } from 'query-string';

import * as api from '../Api';
import { placesDetailedCache as cache } from '../Cache';
import { get } from '../Xhr';
import { PlacesFilter } from './Filter';

export async function getPlaces(filter: PlacesFilter): Promise<any> {
	const apiResponse = await api.getPlaces(filter);
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.places;
}

export async function getPlaceDetailed(id: string): Promise<any> {
	let result = null;
	const fromCache = cache.get(id);

	if (!fromCache) {
		const apiResponse = await get('places/' + id);
		if (!apiResponse.data.hasOwnProperty('place')) {
			throw new Error('Wrong API response');
		}
		result = apiResponse.data.place;
		cache.set(id, result);
	} else {
		result = fromCache;
	}
	return result;
}

export async function getPlaceDetailedBatch(ids: string[]): Promise<any[]> {
	const placesFromCache: any[] = [];
	let placesFromApi: any[] = [];
	const toBeFetchedFromAPI: string[] = [];

	ids.forEach((id: string) => {
		const placeFromCachce = cache.get(id);
		if (placeFromCachce) {
			placesFromCache.push(placeFromCachce);
		} else {
			toBeFetchedFromAPI.push(id);
		}
	});

	if (toBeFetchedFromAPI.length > 0) {
		const apiResponse = await get('places/list?' + stringify({
			ids: toBeFetchedFromAPI.join('|')
		}));

		if (!apiResponse.data.hasOwnProperty('places')) {
			throw new Error('Wrong API response');
		}

		placesFromApi = apiResponse.data.places;
		placesFromApi.forEach((place: any) => {
			cache.set(place.id, place);
		});
	}

	return ids.map((id: string) => {
		const fromCache = placesFromCache.filter((place: any) => {
			return place.id === id;
		});

		if (fromCache[0]) {
			return fromCache[0];
		}

		const fromApi = placesFromApi.filter((place: any) => {
			return place.id === id;
		});

		return fromApi[0];
	});
}

export async function getPlaceMedia(id: string): Promise<any[]> {
	const apiResponse = await get('places/' + id + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media;
}
