import { favoritesCache } from '../Cache';
import { Location } from '../Geo';
import { ApiResponse, delete_, get, post } from '../Xhr';

const CACHE_KEY = 'favorites';

export async function getFavorites(): Promise<string[]> {
	const fromCache = await favoritesCache.get(CACHE_KEY);
	if (fromCache) {
		return fromCache;
	}
	return await getFromApi();
}

export async function addPlaceToFavorites(id: string): Promise<void> {
	await post('favorites', {
		place_id: id
	});
	const favoriteIds = await getFavorites();
	favoriteIds.push(id);
	favoritesCache.set(CACHE_KEY, favoriteIds);
}

export async function addCustomPlaceToFavorites(
	name: string,
	location: Location,
	address: string
): Promise<string> {
	const apiResponse = await post('favorites/custom', {
		name,
		location,
		address
	});
	return apiResponse.data.favorite.place_id;
}

export async function removePlaceFromFavorites(id: string): Promise<ApiResponse> {
	const apiResponse: ApiResponse = await delete_('favorites', {
		place_id: id
	});
	const favoriteIds = await getFavorites();
	await favoritesCache.set(CACHE_KEY, favoriteIds.filter((favoriteId) => favoriteId !== id));
	return apiResponse;
}

export async function handleFavoritesChanges(): Promise<void> {
	await getFromApi();
}

async function getFromApi(): Promise<string[]> {
	const apiResponse: ApiResponse = await get('favorites');
	if (!apiResponse.data.favorites) {
		throw new Error('Wrong API response');
	}
	const favoriteIds = apiResponse.data.favorites.map((favoriteData) => (favoriteData.place_id));
	favoritesCache.set(CACHE_KEY, favoriteIds);
	return favoriteIds;
}
