import { camelizeKeys } from 'humps';
import { stringify } from 'query-string';

import { ApiResponse, StApi } from '../Api';
import { placesDetailedCache as cache } from '../Cache';
import { Bounds, boundsToMapTileKeys, Location, locationToMapTileKey } from '../Geo';
import { Medium } from '../Media/Media';
import { Day, ItineraryItem } from '../Trip';
import { splitArrayToChunks } from '../Util';
import { PlacesListFilter } from './ListFilter';
import {
	mapPlaceApiResponseToPlaces,
	mapPlaceDetailedApiResponseToPlace,
	mapPlaceDetailedBatchApiResponseToPlaces,
	mapPlaceGeometryApiResponseToPlaceGeometry,
	mapPlaceOpeningHours,
	mapPlaceReview,
	mapPlaceReviewsData
} from './Mapper';
import { CustomPlaceFormData, Place } from './Place';
import { PlaceGeometry } from './PlaceGeometry';
import { PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';
import { PlacesStats } from './Stats';
import { PlacesStatsFilter } from './StatsFilter';

export async function getPlaces(filter: PlacesListFilter): Promise<Place[]> {
	const apiResponse: ApiResponse =
		filter.mapSpread ? await getPlacesWithMapSpread(filter) : await StApi.get('places/list?' + filter.toQueryString());
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse.data.places);
}

export async function getPlaceDetailed(id: string, photoSize: string): Promise<any> {
	let result = null;
	const fromCache = await cache.get(id);

	if (!fromCache) {
		const apiResponse = await StApi.get('places/' + id);
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

export async function createCustomPlace(data: CustomPlaceFormData): Promise<Place> {
	const apiResponse: ApiResponse = await StApi.post('places', data);
	if (!apiResponse.data.hasOwnProperty('place')) {
		throw new Error('Wrong API response');
	}
	const result = apiResponse.data.place;
	await cache.set(result.id, result);
	return mapPlaceDetailedApiResponseToPlace(result, '100x100');
}

export async function updateCustomPlace(id: string, data: CustomPlaceFormData): Promise<Place> {
	const apiResponse: ApiResponse = await StApi.put('places/' + id, data);
	if (!apiResponse.data.hasOwnProperty('place')) {
		throw new Error('Wrong API response');
	}
	const result = apiResponse.data.place;
	await cache.set(result.id, result);
	return mapPlaceDetailedApiResponseToPlace(result, '100x100');
}

export async function deleteCustomPlace(id: string): Promise<void> {
	await StApi.delete_('places/' + id, {});
	await cache.remove(id);
	return;
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

export async function getPlacesFromTripDay(day: Day, imageSize: string): Promise<Place[]> {
	const placesIds: string[] = day.itinerary.map((item: ItineraryItem) => (item.placeId));
	return getPlacesDetailed(placesIds, imageSize);
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	const apiResponse = await StApi.get('places/' + id + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media.map((mediaItem: any) => camelizeKeys(mediaItem) as Medium);
}

async function getFromApi(toBeFetchedFromAPI: string[]): Promise<any> {
	const CHUNK_SIZE: number = 50;
	const idsChunks = splitArrayToChunks(toBeFetchedFromAPI, CHUNK_SIZE);
	const apiResponsesForChunks: ApiResponse[] = await Promise.all(idsChunks.map((idsChunk: string[]) => {
		return StApi.get('places?' + stringify({
			ids: idsChunk.join('|')
		}));
	}));

	apiResponsesForChunks.forEach((apiResponse: ApiResponse) => {
		if (!apiResponse.data.hasOwnProperty('places')) {
			throw new Error('Wrong API response');
		}
	});

	return apiResponsesForChunks.reduce((acc: any[], apiResponse: ApiResponse) => {
		if (!apiResponse.data.hasOwnProperty('places')) {
			throw new Error('Wrong API response');
		}
		return acc.concat(apiResponse.data.places);
	}, []);
}

export async function getPlaceGeometry(id: string): Promise<PlaceGeometry> {
	const apiResponse = await StApi.get(`places/${id}/geometry`);
	if (!apiResponse.data.hasOwnProperty('geometry') || !apiResponse.data.hasOwnProperty('is_shape')) {
		throw new Error('Wrong API response');
	}

	return mapPlaceGeometryApiResponseToPlaceGeometry(apiResponse.data);
}

export async function getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
	const apiResponse = await StApi.get(`places/${id}/opening-hours?` + stringify({
		from,
		to
	}));
	if (!apiResponse.data.hasOwnProperty('opening_hours')) {
		throw new Error('Wrong API response');
	}

	return mapPlaceOpeningHours(apiResponse.data.opening_hours);
}

export async function addPlaceReview(placeId: string, rating: number, message: string): Promise<PlaceReview> {
	const apiResponse = await StApi.post('reviews', {
		place_id: placeId,
		rating,
		message
	});
	if (!apiResponse.data.hasOwnProperty('review')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceReview(apiResponse.data.review);
}

export async function deletePlaceReview(reviewId: number): Promise<void> {
	await StApi.delete_(`reviews/${reviewId}`, null);
}

export async function getPlaceReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
	const apiResponse = await StApi.get(`places/${placeId}/reviews?` + stringify({
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
	await StApi.put(`reviews/${reviewId}/votes`, {
		value: voteValue
	});
}

export async function detectParentsByBounds(bounds: Bounds, zoom: number): Promise<Place[]> {
	const swMapTile = locationToMapTileKey({lat: bounds.south, lng: bounds.west}, zoom);
	const neMapTile = locationToMapTileKey({lat: bounds.north, lng: bounds.east}, zoom);
	const apiResponse: ApiResponse = await StApi.get(`places/detect-parents/main-in-bounds?` + stringify({
		map_tile_bounds: swMapTile + ',' + neMapTile
	}));
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse.data.places);
}

export async function detectParentsByLocation(location: Location): Promise<Place[]> {
	const apiResponse: ApiResponse = await StApi.get(`places/detect-parents?` + stringify({
		location: location.lat + ',' + location.lng
	}));
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse.data.places);
}

export async function getPlacesStats(filter: PlacesStatsFilter): Promise<PlacesStats> {
	if (filter.bounds) {
		filter = filter.switchBoundsToMapTileBounds();
	}
	const apiResponse: ApiResponse = await StApi.get(`places/stats?` + filter.toQueryString());
	if (!apiResponse.data.hasOwnProperty('stats')) {
		throw new Error('Wrong API response');
	}
	return {
		categories: apiResponse.data.stats.categories.map((item) => camelizeKeys(item)),
		tags: apiResponse.data.stats.tags.map((item) => camelizeKeys(item)),
	} as PlacesStats;
}

async function getPlacesWithMapSpread(filter: PlacesListFilter): Promise<ApiResponse> {

	const mapTiles: string[] = boundsToMapTileKeys(filter.bounds as Bounds, filter.zoom as number);

	const apiResults: Promise<ApiResponse>[] = [];

	for (const mapTile of mapTiles) {
		let apiFilter = filter.cloneSetBounds(null);
		apiFilter = apiFilter.cloneSetLimit(32);
		apiFilter = apiFilter.cloneSetMapTiles([mapTile]);
		const promise = new Promise<ApiResponse>(async (success) => {
			try {
				success(await StApi.get('places/list?' + apiFilter.toQueryString()));
			} catch (error) {
				success(new ApiResponse(200, {places: []}));
			}
		});
		apiResults.push(promise);
	}

	const responses = await Promise.all(apiResults);
	const finalResponse: ApiResponse = responses.reduce((result: ApiResponse, response: ApiResponse): ApiResponse => {
		result.statusCode = response.statusCode;
		result.data.places = result.data.places.concat(response.data.places);
		return result;
	}, new ApiResponse(200, {places: []}));

	finalResponse.data.places = finalResponse.data.places.sort((a, b) => {
		if (a.rating > b.rating) { return -1; }
		return 1;
	});
	return finalResponse;
}
