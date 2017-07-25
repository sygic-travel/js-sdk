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
	const relevantChanges: ChangeNotification[] = [];

	for (const changeNotification of changeNotifications) {
		if (!changeNotification.id) {
			continue;
		}

		const placeId = changeNotification.id;
		if (changeNotification.change === 'updated' && await Dao.shouldNotifyOnFavoritesUpdate(placeId)) {
			relevantChanges.push(changeNotification);
		}

		if (changeNotification.change === 'deleted' && await Dao.isFavoriteInCache(placeId)) {
			Dao.removeFavoriteFromCache(placeId);
			relevantChanges.push(changeNotification);
		}
	}
	return relevantChanges;
}
