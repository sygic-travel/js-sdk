import { Location } from '../Geo';
import * as Dao from './DataAccess';

export async function getFavoritesIds(): Promise<string[]> {
	return Dao.getFavorites();
}

export async function addPlaceToFavorites(id: string): Promise<void> {
	await Dao.addPlaceToFavorites(id);
}

export async function addCustomPlaceToFavorites(
	name: string,
	location: Location,
	address: string
): Promise<string> {
	return await Dao.addCustomPlaceToFavorites(name, location, address);
}

export async function removePlaceFromFavorites(id: string): Promise<void> {
	await Dao.removePlaceFromFavorites(id);
}
