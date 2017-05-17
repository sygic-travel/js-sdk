import { Location } from '../Geo';
import { ApiResponse, delete_, get, post } from '../Xhr';

export async function getFavorites(): Promise<ApiResponse> {
	return await get('favorites');
}

export async function addPlaceToFavorites(id: string): Promise<ApiResponse> {
	return await post('favorites', {
		place_id: id
	});
}

export async function addCustomPlaceToFavorites(
	name: string,
	location: Location,
	address: string
): Promise<ApiResponse> {
	return await post('favorites/custom', {
		name,
		location,
		address
	});
}

export async function removePlaceFromFavorites(id: string): Promise<ApiResponse> {
	return await delete_('favorites', {
		place_id: id
	});
}
