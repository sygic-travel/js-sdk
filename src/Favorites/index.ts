import { ChangeNotification } from '../Changes';
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

export async function handleFavoritesChanges(changeNotifications: ChangeNotification[]): Promise<ChangeNotification[]> {
	if (changeNotifications.length > 0) {
		await Dao.handleFavoritesChanges();
	}
	return changeNotifications;
}
