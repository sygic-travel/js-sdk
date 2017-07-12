import { BaseSDK } from './BaseSDK';
import { ChangeNotification, initializeChangesWatching, setChangesCallback, stopChangesWatching } from './Changes';
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
import { addCustomPlaceToFavorites, addPlaceToFavorites, getFavoritesIds, removePlaceFromFavorites } from './Favorites';
import { Forecast, getDestinationWeather } from './Forecast';
import { Bounds, Location } from './Geo';
import { Medium } from './Media';
import {
	addPlaceReview,
	deletePlaceReview,
	getPlaceDetailed,
	getPlaceGeometry,
	getPlaceMedia,
	getPlaceOpeningHours,
	getPlaceReviews,
	getPlaces,
	getPlacesDetailed,
	Place,
	PlaceGeometry,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewsData,
	PlacesFilter,
	PlacesFilterJSON,
	voteOnReview
} from './Places';
import { getRoutesForTripDay, Route } from './Route';
import { searchAddress, SearchAddressResult, searchAddressReverse } from './Search';
import * as Settings from './Settings';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from './Spread';
import {
	CategoriesCoefficients,
	spread as spreadV2,
	SpreadResult as SpreadResultV2,
	SpreadSizeConfig as SpreadSizeConfigV2
} from './SpreadV2';
import { getTours, Tour, ToursQuery } from './Tours';
import {
	addDaysToTrip,
	addPlaceToDay,
	cloneTrip,
	createTrip,
	emptyTripsTrash,
	getTripDetailed,
	getTrips,
	movePlaceInDay,
	prependDaysToTrip,
	removeDayFromTrip,
	removePlacesFromDay,
	setTransport,
	swapDaysInTrip,
	TransportSettings,
	Trip,
	TripConflictHandler,
	TripUpdateData,
	updateTrip,
} from './Trip';
import { getUserSettings, setUserSession, updateUserSettings, UserSettings } from './User';

export default class StSDK extends BaseSDK {
	public setUserSession(key: string | null, token: string | null): Promise<void> {
		return setUserSession(key, token);
	}

	public getPlaces(filter: PlacesFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesFilter(filter));
	}

	public getPlaceDetailed(id: string, photoSize: string): Promise<Place> {
		return getPlaceDetailed(id, photoSize);
	}

	public getPlacesDetailed(ids: string[], photoSize: string): Promise<Place[]> {
		return getPlacesDetailed(ids, photoSize);
	}

	public getPlaceMedia(id: string): Promise<Medium[]> {
		return getPlaceMedia(id);
	}

	/**
	 * @experimental
	 */
	public getPlaceGeometry(id: string): Promise<PlaceGeometry> {
		return getPlaceGeometry(id);
	}

	/**
	 * @experimental
	 */
	public getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
		return getPlaceOpeningHours(id, from, to);
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
	public spreadPlacesOnMapV2(
		places: Place[],
		vipPlaces: Place[],
		bounds: Bounds,
		canvas: CanvasSize,
		categoriesCoefficients?: CategoriesCoefficients | null,
		sizesConfig?: SpreadSizeConfigV2[]
	): SpreadResultV2 {
		return spreadV2(places, vipPlaces, bounds, canvas, categoriesCoefficients, sizesConfig);
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
	public createTrip(startDate: string, name: string, placeId: string): Promise<Trip> {
		return createTrip(startDate, name, placeId);
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
	public cloneTrip(id): Promise<string> {
		return cloneTrip(id);
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
	public addDaysToTrip(id: string, count: number): Promise<Trip> {
		return addDaysToTrip(id, count);
	}

	/**
	 * @experimental
	 */
	public prependDaysToTrip(id: string, count: number): Promise<Trip> {
		return prependDaysToTrip(id, count);
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
	public removePlacesFromDay(id: string, dayIndex: number, positionsInDay: number[]): Promise<Trip> {
		return removePlacesFromDay(id, dayIndex, positionsInDay);
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

	/**
	 * @experimental
	 */
	public searchAddressReverse(location: Location): Promise<SearchAddressResult[]> {
		return searchAddressReverse(location);
	}

	/**
	 * @experimental
	 */
	public initializeChangesWatching(tickInterval: number): Promise<void> {
		return initializeChangesWatching(tickInterval);
	}

	/**
	 * @experimental
	 */
	public stopChangesWatching(): void {
		return stopChangesWatching();
	}

	/**
	 * @experimental
	 */
	public setChangesCallback(callback: (changeNotifications: ChangeNotification[]) => any | null): void {
		setChangesCallback(callback);
	}

	/**
	 * @experimental
	 */
	public getDestinationWeather(destinationId: string): Promise<Forecast[]> {
		return getDestinationWeather(destinationId);
	}

	/**
	 * @experimental
	 */
	public getUserSettings(): Promise<UserSettings> {
		return getUserSettings();
	}

	/**
	 * @experimental
	 */
	public updateUserSettings(settings: UserSettings): Promise<UserSettings> {
		return updateUserSettings(settings);
	}

	/**
	 * @experimental
	 */
	public setTripConflictHandler(
		handler: null | TripConflictHandler
	): void {
		Settings.setTripConflictHandler(handler);
	}

	/**
	 * @experimental
	 */
	public getTours(toursQuery: ToursQuery): Promise<Tour[]> {
		return getTours(toursQuery);
	}

	/**
	 * @experimental
	 */
	public addPlaceReview(placeId: string, rating: number, message: string): Promise<PlaceReview> {
		return addPlaceReview(placeId, rating, message);
	}

	/**
	 * @experimental
	 */
	public deletePlaceReview(reviewId: number): Promise<void> {
		return deletePlaceReview(reviewId);
	}

	/**
	 * @experimental
	 */
	public getPlaceReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
		return getPlaceReviews(placeId, limit, page);
	}

	/**
	 * @experimental
	 */
	public voteOnReview(reviewId: number, voteValue: number): Promise<void> {
		return voteOnReview(reviewId, voteValue);
	}

	/**
	 * @experimental
	 */
	public emptyTripsTrash(): Promise<string[]> {
		return emptyTripsTrash();
	}
}
