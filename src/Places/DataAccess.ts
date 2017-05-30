import { stringify } from 'query-string';

import * as api from '../Api';
import { placesDetailedCache as cache } from '../Cache';
import { Medium } from '../Media/Media';
import { get } from '../Xhr';
import { PlacesFilter } from './Filter';
import {
mapPlaceApiResponseToPlaces, mapPlaceDetailedApiResponseToPlace,
mapPlaceDetailedBatchApiResponseToPlaces
} from './Mapper';
import { Place } from './Place';

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	const apiResponse = await api.getPlaces(filter);
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse.data.places);
}

export async function getPlaceDetailed(id: string, photoSize: string): Promise<any> {
	let result = null;
	const fromCache = await cache.get(id);

	if (!fromCache) {
		const apiResponse = await get('places/' + id);
		if (!apiResponse.data.hasOwnProperty('place')) {
			throw new Error('Wrong API response');
		}
		result = apiResponse.data.place;
		await cache.set(id, result);
	} else {
		result = fromCache;
	}
	return mapPlaceDetailedApiResponseToPlace(result, photoSize);
}

export async function getPlaceDetailedBatch(ids: string[], photoSize: string): Promise<Place[]> {
	const placesFromCache: any[] = [];
	let placesFromApi: any[] = [];
	const toBeFetchedFromAPI: string[] = [];

	await Promise.all(ids.map(async (id: string) => {
		const placeFromCachce = await cache.get(id);
		if (placeFromCachce) {
			placesFromCache.push(placeFromCachce);
		} else {
			toBeFetchedFromAPI.push(id);
		}
	}));

	if (toBeFetchedFromAPI.length > 0) {
		placesFromApi = await getFromApi(toBeFetchedFromAPI);
		await Promise.all(placesFromApi.map(async (place: any) => {
			await cache.set(place.id, place);
		}));
	}

	const batch: Place[] = ids.map((id: string) => {
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

	return mapPlaceDetailedBatchApiResponseToPlaces(batch, photoSize);
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	const apiResponse = await get('places/' + id + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media.map((mediaItem: any) => mediaItem as Medium);
}

async function getFromApi(toBeFetchedFromAPI: string[]): Promise<any> {
	const apiResponse = await get('places?' + stringify({
		ids: toBeFetchedFromAPI.join('|')
	}));

	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}

	return apiResponse.data.places;
}
