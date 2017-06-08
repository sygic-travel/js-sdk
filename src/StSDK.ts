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
	addDayToTrip,
	addPlaceToDay,
	getTripDetailed,
	getTrips,
	movePlaceInDay,
	prependDayToTrip,
	removeDayFromTrip,
	removePlaceFromDay,
	setTransport,
	swapDaysInTrip,
	TransportSettings,
	Trip,
	TripUpdateData,
	updateTrip
} from './Trip';

import {
	acceptTripCollaboration,
	addTripCollaboration,
	Collaboration,
	followTrip,
	getTripCollaborations,
	removeTripCollaboration,
	resendInvitation,
	unfollowTrip,
	updateTripCollaboration
} from './Collaboration';

import {
	searchAddress,
	SearchAddressResult
} from './Search';

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
		bounds: Bounds,
		canvas: CanvasSize,
		sizesConfig?: SpreadSizeConfig[]
	): SpreadResult {
		return spread(places, bounds, canvas, sizesConfig);
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
		return addDayToTrip(id);
	}

	/**
	 * @experimental
	 */
	public prependDayToTrip(id: string): Promise<Trip> {
		return prependDayToTrip(id);
	}

	/**
	 * @experimental
	 */
	public removeDayFromTrip(id: string, dayIndex: number): Promise<Trip> {
		return removeDayFromTrip(id, dayIndex);
	}

	/**
	 * @experimental
	 */
	public swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trip> {
		return swapDaysInTrip(id, firstDayIndex, secondDayIndex);
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
	public removePlaceFromDay(id: string, dayIndex: number, positionInDay: number): Promise<Trip> {
		return removePlaceFromDay(id, dayIndex, positionInDay);
	}

	/**
	 * @experimental
	 */
	public addPlaceToDay(
		tripId: string,
		placeId: string,
		dayIndex: number,
		positionInDay?: number): Promise<Trip> {
			return addPlaceToDay(tripId, placeId, dayIndex, positionInDay);
	}

	/**
	 * @experimental
	 */
	public setTransport(id: string, dayIndex: number, itemIndex: number, settings: TransportSettings): Promise<Trip> {
		return setTransport(id, dayIndex, itemIndex, settings);
	}

	/**
	 * @experimental
	 */
	public followTrip(tripId: string): Promise<void> {
		return followTrip(tripId);
	}

	/**
	 * @experimental
	 */
	public unfollowTrip(tripId: string): Promise<void> {
		return unfollowTrip(tripId);
	}

	/**
	 * @experimental
	 */
	public addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void> {
		return addTripCollaboration(tripId, userEmail, accessLevel);
	}

	/**
	 * @experimental
	 */
	public getTripCollaborations(tripId: string): Promise<Collaboration[]> {
		return getTripCollaborations(tripId);
	}

	/**
	 * @experimental
	 */
	public removeTripCollaboration(collaborationId: string): Promise<void> {
		return removeTripCollaboration(collaborationId);
	}

	/**
	 * @experimental
	 */
	public acceptTripCollaboration(collaborationId: string, hash: string): Promise<string> {
		return acceptTripCollaboration(collaborationId, hash);
	}

	/**
	 * @experimental
	 */
	public resendInvitation(collaborationId: string): Promise<void> {
		return resendInvitation(collaborationId);
	}

	/**
	 * @experimental
	 */
	public updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void> {
		return updateTripCollaboration(collaborationId, accessLevel);
	}

	/**
	 * @experimental
	 */
	public searchAddress(query: string, location?: Location): Promise<SearchAddressResult[]> {
		return searchAddress(query, location);
	}
}
