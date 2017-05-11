import { Location } from '../Geo';
import { getPlaceDetailedBatch, Place } from '../Places/index';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Api from './Api';

export async function getFavorites(photoSize: string): Promise<Place[]> {
	const apiResponse: ApiResponse = await Api.getFavorites();
	if (!apiResponse.data.hasOwnProperty('favorites')) {
		throw new Error('Wrong API response');
	}
	return getPlaceDetailedBatch(apiResponse.data.favorites.map((favorite) => {
		return favorite.place_id;
	}), photoSize);
}

export async function addPlaceToFavorites(id: string): Promise<boolean> {
	const apiResponse: ApiResponse = await Api.addPlaceToFavorites(id);
	return apiResponse.statusCode === 200;
}

export async function addCustomPlaceToFavorites(
	name: string,
	location: Location,
	address: string
): Promise<boolean | string> {
	const apiResponse: ApiResponse = await Api.addCustomPlaceToFavorites(name, location, address);

	if (apiResponse.statusCode === 200) {
		return apiResponse.data.favorite.place_id;
	}

	return false;
}

export async function removePlaceFromFavorites(id: string): Promise<boolean> {
	const apiResponse: ApiResponse = await Api.removePlaceFromFavorites(id);
	return apiResponse.statusCode === 200;
};
