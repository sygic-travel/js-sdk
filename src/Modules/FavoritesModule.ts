import {
	addCustomPlaceToFavorites,
	addPlaceToFavorites,
	getFavoritesIds,
	removePlaceFromFavorites
} from '../Favorites';
import { Location } from '../Geo';

/**
 * @experimental
 */
export default class FavoritesModule {
	public addPlaceToFavorites(id: string): Promise<void> {
		return addPlaceToFavorites(id);
	}

	public addCustomPlaceToFavorites(name: string, location: Location, address: string): Promise<string> {
		return addCustomPlaceToFavorites(name, location, address);
	}

	public getFavoritesIds(): Promise<string[]> {
		return getFavoritesIds();
	}

	public removePlaceFromFavorites(id: string): Promise<void> {
		return removePlaceFromFavorites(id);
	}
}
