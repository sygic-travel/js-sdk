import { camelizeKeys } from 'humps';
import { stringify } from 'query-string';

import * as api from '../Api';
import { placesDetailedCache as cache } from '../Cache';
import { Medium } from '../Media/Media';
import { Day, ItineraryItem } from '../Trip';
import { delete_, get, post, put } from '../Xhr';
import { PlacesFilter } from './Filter';
import {
	mapPlaceApiResponseToPlaces,
	mapPlaceDetailedApiResponseToPlace,
	mapPlaceDetailedBatchApiResponseToPlaces,
	mapPlaceGeometryApiResponseToPlaceGeometry,
	mapPlaceOpeningHours,
	mapPlaceReview,
	mapPlaceReviewsData
} from './Mapper';
import { Place } from './Place';
import { PlaceGeometry } from './PlaceGeometry';
import { PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';

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

export async function getPlacesDetailed(ids: string[], photoSize: string): Promise<Place[]> {
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

	const places: Place[] = ids.reduce((availPlaces: Place[], id: string) => {
		const fromCache = placesFromCache.find((place: any) => {
			return place.id === id;
		});

		if (fromCache) {
			availPlaces.push(fromCache);
		}

		const fromApi = placesFromApi.find((place: any) => {
			return place.id === id;
		});

		if (fromApi) {
			availPlaces.push(fromApi);
		}

		return availPlaces;
	}, []);

	return mapPlaceDetailedBatchApiResponseToPlaces(places, photoSize);
}

export async function getPlacesFromTripDay(day: Day): Promise<Place[]> {

	const placesIds: string[] = day.itinerary.map((item: ItineraryItem) => (item.placeId));
	return getPlacesDetailed(placesIds, '100x100');
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	const apiResponse = await get('places/' + id + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media.map((mediaItem: any) => camelizeKeys(mediaItem) as Medium);
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

export async function getPlaceGeometry(id: string): Promise<PlaceGeometry> {
	const apiResponse = await get(`places/${id}/geometry`);
	if (!apiResponse.data.hasOwnProperty('geometry') || !apiResponse.data.hasOwnProperty('is_shape')) {
		throw new Error('Wrong API response');
	}

	return mapPlaceGeometryApiResponseToPlaceGeometry(apiResponse.data);
}

export async function getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
	const apiResponse = await get(`places/${id}/opening-hours?` + stringify({
		from,
		to
	}));
	if (!apiResponse.data.hasOwnProperty('opening_hours')) {
		throw new Error('Wrong API response');
	}

	return mapPlaceOpeningHours(apiResponse.data.opening_hours);
}

export async function addItemReview(placeId: number, rating: number, message: string): Promise<PlaceReview> {
	const apiResponse = await post('reviews', {
		item_guid: placeId,
		rating,
		message
	});
	if (!apiResponse.data.hasOwnProperty('review')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceReview(apiResponse.data.review);
}

export async function deleteItemReview(reviewId: number): Promise<void> {
	await delete_(`reviews/${reviewId}`, null);
}

export async function getItemReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
	const apiResponse = await get(`items/${placeId}/reviews` + stringify({
		limit,
		page
	}));
	if (!apiResponse.data.hasOwnProperty('reviews') ||
		!apiResponse.data.hasOwnProperty('rating') ||
		!apiResponse.data.hasOwnProperty('current_user_has_review')
	) {
		throw new Error('Wrong API response');
	}
	return mapPlaceReviewsData(apiResponse.data);
}

export async function voteOnReview(reviewId: number, voteValue: number): Promise<void> {
	await put(`reviews/${reviewId}/votes`, {
		value: voteValue
	});
}
