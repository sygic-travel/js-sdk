import { Location } from '../Geo';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Api from './Api';

export async function getFavoritesIds(): Promise<string[]> {
	const apiResponse: ApiResponse = await Api.getFavorites();
	if (!apiResponse.data.hasOwnProperty('favorites')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.favorites.map((favorite) => {
		return favorite.place_id;
	});
}

export async function addPlaceToFavorites(id: string): Promise<void> {
	await Api.addPlaceToFavorites(id);
}

export async function addCustomPlaceToFavorites(
	name: string,
	location: Location,
	address: string
): Promise<string> {
	const apiResponse: ApiResponse = await Api.addCustomPlaceToFavorites(name, location, address);
	return apiResponse.data.favorite.place_id;
}

export async function removePlaceFromFavorites(id: string): Promise<void> {
	await Api.removePlaceFromFavorites(id);
}
