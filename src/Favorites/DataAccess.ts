import { favoritesCache } from '../Cache';
import { Location } from '../Geo';
import { ApiResponse, delete_, get, post } from '../Xhr';

export async function getFavorites(): Promise<string[]> {
	const fromCache: string[] = await favoritesCache.getAll();
	if (fromCache.length > 0) {
		return fromCache;
	}
	return await getFromApi();
}

export async function addPlaceToFavorites(id: string): Promise<void> {
	await post('favorites', {
		place_id: id
	});
	favoritesCache.set(id, id);
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
	await removeFavoriteFromCache(id);
	return apiResponse;
}

export async function shouldNotifyOnFavoritesUpdate(id: string): Promise<boolean> {
	const favoriteFromCache: string = await favoritesCache.get(id);
	if (favoriteFromCache) {
		return false;
	}
	await getFromApi();
	return true;
}

export async function isFavoriteInCache(id: string): Promise<boolean> {
	return !!await favoritesCache.get(id);
}

export async function removeFavoriteFromCache(id: string): Promise<void> {
	await favoritesCache.remove(id);
}

async function getFromApi(): Promise<string[]> {
	const apiResponse: ApiResponse = await get('favorites');
	if (!apiResponse.data.favorites) {
		throw new Error('Wrong API response');
	}
	const favoriteIds = apiResponse.data.favorites.map((favoriteData) => (favoriteData.place_id));
	await Promise.all(favoriteIds.map((favoriteId: string) => favoritesCache.set(favoriteId, favoriteId)));
	return favoriteIds;
}
