import { BaseSDK } from './BaseSDK';
import { addCustomPlaceToFavorites, addPlaceToFavorites, getFavoritesIds, removePlaceFromFavorites } from './Favorites';
import { Bounds } from './Geo';
import { Location } from './Geo';
import { Medium } from './Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces, Place, PlacesFilter, PlacesFilterJSON } from './Places';
import { getRoutesForTripDay, Route } from './Route';
import { setUserSession } from './Settings/index';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from './Spread';
import {
	addDay,
	addDayToBeginning,
	addPlaceToDay,
	getTripDetailed,
	getTrips,
	movePlaceInDay,
	removeDay,
	removePlaceInDay,
	swapDays,
	Trip,
	TripUpdateData,
	updateTrip
} from './Trip';

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

	/**
	 * @experimental
	 */
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<Route[]> {
		return getRoutesForTripDay(tripId, dayIndex);
	}

	/**
	 * @experimental
	 */
	public getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
		return getTrips(dateFrom, dateTo);
	}

	/**
	 * @experimental
	 */
	public getTripDetailed(id: string): Promise<Trip> {
		return getTripDetailed(id);
	}

	/**
	 * @experimental
	 */
	public updateTrip(id, dataToUpdate: TripUpdateData): Promise<Trip> {
		return updateTrip(id, dataToUpdate);
	}

	/**
	 * @experimental
	 */
	public addPlaceToFavorites(id: string): Promise<void> {
		return addPlaceToFavorites(id);
	}

	/**
	 * @experimental
	 */
	public addCustomPlaceToFavorites(name: string, location: Location, address: string): Promise<string> {
		return addCustomPlaceToFavorites(name, location, address);
	}

	/**
	 * @experimental
	 */
	public getFavoritesIds(): Promise<string[]> {
		return getFavoritesIds();
	}

	/**
	 * @experimental
	 */
	public removePlaceFromFavorites(id: string): Promise<void> {
		return removePlaceFromFavorites(id);
	}

	/**
	 * @experimental
	 */
	public addDayToTrip(id: string): Promise<Trip> {
		return addDay(id);
	}

	/**
	 * @experimental
	 */
	public addDayToBeginning(id: string): Promise<Trip> {
		return addDayToBeginning(id);
	}

	/**
	 * @experimental
	 */
	public removeDay(id: string, dayIndex: number): Promise<Trip> {
		return removeDay(id, dayIndex);
	}

	/**
	 * @experimental
	 */
	public swapDays(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trip> {
		return swapDays(id, firstDayIndex, secondDayIndex);
	}

	/**
	 * @experimental
	 */
	public movePlaceInDay(id: string, dayIndex: number, positionFrom: number, positionTo: number): Promise<Trip> {
		return movePlaceInDay(id, dayIndex, positionFrom, positionTo);
	}

	/**
	 * @experimental
	 */
	public removePlaceInDay(id: string, dayIndex: number, positionInDay: number): Promise<Trip> {
		return removePlaceInDay(id, dayIndex, positionInDay);
	}

	/**
	 * @experimental
	 */
	public async addPlaceToDay(
		tripId: string,
		placeId: string,
		dayIndex: number,
		positionInDay?: number): Promise<Trip> {
			return addPlaceToDay(tripId, placeId, dayIndex, positionInDay);
	}
}
