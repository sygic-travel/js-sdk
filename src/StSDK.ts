import { BaseSDK } from './BaseSDK';
import { addCustomPlaceToFavorites, addPlaceToFavorites, getFavorites, removePlaceFromFavorites } from './Favorites';
import { Bounds } from './Geo';
import { Location } from './Geo';
import { Medium } from './Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces, Place, PlacesFilter, PlacesFilterJSON } from './Places';
import { setUserSession } from './Settings/index';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from './Spread';
import { getTripDetailed, getTrips, Trip } from './Trip';

export default class StSDK extends BaseSDK {
	public setUserSession(key: string | null, token: string | null): void {
		return setUserSession(key, token);
	}

	public getPlaces(filter: PlacesFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesFilter(filter));
	}

	public getPlaceDetailed(id: string, photoSize: string): Promise<Place> {
		return getPlaceDetailed(id, photoSize);
	}

	public getPlaceMedia(id: string): Promise<Medium[]> {
		return getPlaceMedia(id);
	}

	public spreadPlacesOnMap(
		places: Place[],
		markerSizes: SpreadSizeConfig[],
		bounds: Bounds,
		canvas: CanvasSize
	): SpreadResult {
		return spread(places, markerSizes, bounds, canvas);
	}

	public getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
		return getTrips(dateFrom, dateTo);
	}

	public getTripDetailed(id: string): Promise<Trip> {
		return getTripDetailed(id);
	}

	public addPlaceToFavorites(id: string): Promise<boolean> {
		return addPlaceToFavorites(id);
	}

	public addCustomPlaceToFavorites(name: string, location: Location, address: string): Promise<boolean | string> {
		return addCustomPlaceToFavorites(name, location, address);
	}

	public getFavorites(photoSize: string): Promise<Place[]> {
		return getFavorites(photoSize);
	}

	public removePlaceFromFavorites(id: string): Promise<boolean> {
		return removePlaceFromFavorites(id);
	}
}
