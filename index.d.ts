import * as _Changes from './src/Changes';
import * as _Collaboration from './src/Collaboration';
import * as _Forecast from './src/Forecast';
import * as _Geo from './src/Geo';
import * as _Media from './src/Media/Media';
import * as _Place from './src/Places';
import * as _Route from './src/Route';
import * as _Search from './src/Search';
import * as _Spread from './src/Spread';
import * as _SpreadV2 from './src/SpreadV2';
import * as _Tours from './src/Tours';
import * as _Trip from './src/Trip';
import * as _User from './src/User';

export function create(apiUrl: string, clientKey: string): StSDK;

export class StSDK {
	public getPlaces(filter: _Place.PlacesFilterJSON): Promise<_Place.Place[]>;
	public getPlaceDetailed(id: string, photoSize: string): Promise<_Place.Place>;
	public getPlacesDetailed(id: string[], photoSize: string): Promise<_Place.Place[]>;
	public getPlaceMedia(guid: string): Promise<_Media.Medium[]>;
	/**
	 * @experimental
	 */
	public getPlaceGeometry(id: string): Promise<_Place.PlaceGeometry>
	/**
	 * @experimental
	 */
	public getPlaceOpeningHours(id: string, from: string, to: string): Promise<_Place.PlaceOpeningHours>
	public spreadPlacesOnMap(
		places: _Place.Place[],
		bounds: _Geo.Bounds,
		canvas: _Spread.CanvasSize,
		markerSizes?: _Spread.SpreadSizeConfig[]
	): _Spread.SpreadResult;

	/**
	 * @experimental
	 */
	public spreadPlacesOnMapV2(
		places: _Place.Place[],
		vipPlaces: _Place.Place[],
		bounds: _Geo.Bounds,
		canvas: _Spread.CanvasSize,
		categoriesCoefficients?: _SpreadV2.CategoriesCoefficients | null,
		markerSizes?: _SpreadV2.SpreadSizeConfig[]
	): _SpreadV2.SpreadResult;
	/**
	 * @experimental
	 */
	public addPlaceToFavorites(id: string): Promise<void>;
	/**
	 * @experimental
	 */
	public addCustomPlaceToFavorites(name: string, location: _Geo.Location, address: string): Promise<string>;
	/**
	 * @experimental
	 */
	public getFavoritesIds(): Promise<string[]>;
	/**
	 * @experimental
	 */
	public removePlaceFromFavorites(id: string): Promise<void>
	/**
	 * @experimental
	 */
	public getTrips(dateFrom: string, dateTo: string): Promise<_Trip.Trip[]>;
	/**
	 * @experimental
	 */
	public getTripDetailed(id: string): Promise<_Trip.Trip>;
	/**
	 * @experimental
	 */
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<_Route.Route[]>
	/**
	 * @experimental
	 */
	public createTrip(startDate: string, name: string, placeId: string): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public updateTrip(id, dataToUpdate: _Trip.TripUpdateData): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public cloneTrip(id): Promise<string>
	/**
	 * @experimental
	 */
	public addDayToTrip(id: string): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public prependDayToTrip(id: string): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public removeDayFromTrip(id: string, dayIndex: number): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<_Trip.Trip>

	/**
	 * @experimental
	 */
	public movePlaceInDay(id: string, dayIndex: number, positionFrom: number, positionTo: number): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public removePlaceFromDay(id: string, dayIndex: number, positionInDay: number): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public addPlaceToDay(
		tripId: string,
		placeId: string,
		dayIndex: number,
		positionInDay?: number): Promise<_Trip.Trip>
	/**
	 * @experimental
	 */
	public followTrip(tripId: string): Promise<void>
	/**
	 * @experimental
	 */
	public unfollowTrip(tripId: string): Promise<void>
	/**
	 * @experimental
	 */
	public addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void>
	/**
	 * @experimental
	 */
	public getTripCollaborations(tripId: string): Promise<_Collaboration.Collaboration[]>
	/**
	 * @experimental
	 */
	public removeTripCollaboration(collaborationId: string): Promise<void>
	/**
	 * @experimental
	 */
	public acceptTripCollaboration(collaborationId: string, hash: string): Promise<void>
	/**
	 * @experimental
	 */
	public resendInvitation(collaborationId: string): Promise<void>
	/**
	 * @experimental
	 */
	public searchAddress(query: string, location: Location): Promise<_Search.SearchAddressResult[]>
	/**
	 * @experimental
	 */
	public searchAddressReverse(location: Location): Promise<_Search.SearchAddressResult[]>
	/**
	 * @experimental
	 */
	public getDestinationWeather(destinationId: string): Promise<_Forecast.Forecast[]>
	/**
	 * @experimental
	 */
	public getUserSettings(): Promise<_User.UserSettings>
	/**
	 * @experimental
	 */
	public updateUserSettings(settings: _User.UserSettings): Promise<_User.UserSettings>
	/**
	 * @experimental
	 */
	public initializeChangesWatching(tickInterval: number): Promise<void>
	/**
	 * @experimental
	 */
	public stopChangesWatching(): void
	/**
	 * @experimental
	 */
	public setChangesCallback(callback: (changeNotifications: _Changes.ChangeNotification[]) => any | null): void
	/**
	 * @experimental
	 */
	public setTripConflictHandler(
		handler: null | ((conflictInfo: _Trip.TripConflictInfo, trip: _Trip.Trip)
			=> Promise<_Trip.TripConflictClientResolution>)
	): void
	/**
	 * @experimental
	 */
	public getTours(toursQuery: _Tours.ToursQuery): Promise<_Tours.Tour[]>
	/**
	 * @experimental
	 */
	public addPlaceReview(placeId: string, rating: number, message: string): Promise<_Place.PlaceReview>
	/**
	 * @experimental
	 */
	public deletePlaceReview(reviewId: number): Promise<void>
	/**
	 * @experimental
	 */
	public getPlaceReviews(placeId: string, limit: number, page: number): Promise<_Place.PlaceReviewsData>
	/**
	 * @experimental
	 */
	public voteOnReview(reviewId: number, voteValue: number): Promise<void>
}

export namespace Places {
	export import Place = _Place.Place;
	export import PlacesFilterJSON = _Place.PlacesFilterJSON;
	export import PlaceDetail = _Place.PlaceDetail;
	export import PlaceGeometry = _Place.PlaceGeometry;
	export import PlaceOpeningHours = _Place.PlaceOpeningHours;
	export import Reference = _Place.Reference;
	export import Tag = _Place.Tag;
	export import Description = _Place.Description;
	export import PlaceReview = _Place.PlaceReview;
	export import PlaceReviewsData = _Place.PlaceReviewsData;
}

export namespace Geo {
	export import Bounds = _Geo.Bounds;
	export import Location = _Geo.Location;
	export import Coordinate = _Geo.Coordinate;
}

export namespace Media {
	export import MainMedia = _Media.MainMedia;
	export import Medium = _Media.Medium;
	export import Attribution = _Media.Attribution;
	export import Source = _Media.Source;
	export import Original = _Media.Original;
}

export namespace Spread {
	export import SpreadSizeConfig = _Spread.SpreadSizeConfig;
	export import CanvasSize = _Spread.CanvasSize;
	export import SpreadResult = _Spread.SpreadResult;
	export import SpreadedPlace = _Spread.SpreadedPlace;
}

export namespace SpreadV2 {
	export import SpreadSizeConfigV2 = _SpreadV2.SpreadSizeConfig;
	export import SpreadResultV2 = _SpreadV2.SpreadResult;
	export import SpreadedPlaceV2 = _SpreadV2.SpreadedPlace;
	export import CategoriesCoefficients = _SpreadV2.CategoriesCoefficients;
}

export namespace Trips {
	export import Trip = _Trip.Trip;
	export import Day = _Trip.Day;
	export import TripConflictClientResolution = _Trip.TripConflictClientResolution;
	export import TripConflictHandler = _Trip.TripConflictHandler;
	export import TripConflictInfo = _Trip.TripConflictInfo;
	export import ItineraryItem = _Trip.ItineraryItem;
	export import TripPrivileges = _Trip.TripPrivileges;
	export import TripMedia = _Trip.TripMedia;
	export import Collaboration = _Collaboration.Collaboration;
}

export namespace Route {
	export import Direction = _Route.Direction;
	export import DirectionSource = _Route.DirectionSource;
	export import Route = _Route.Route;
}

export namespace Search {
	export import Address = _Search.Address;
	export import AddressFields = _Search.AddressFields;
	export import SearchAddressResult = _Search.SearchAddressResult;
}

export namespace Forecast {
	export import Forecast = _Forecast.Forecast;
	export import ForecastTemperature = _Forecast.ForecastTemperature;
	export import ForecastWeather = _Forecast.ForecastWeather;
}

export namespace User {
	export import UserSettings = _User.UserSettings;
}

export namespace Changes {
	export import ChangeNotification = _Changes.ChangeNotification;
}

export namespace Tours {
	export import Tour = _Tours.Tour;
	export import ToursQuery = _Tours.ToursQuery;
	export import ToursQueryDirection = _Tours.ToursQueryDirection;
	export import ToursQuerySortBy = _Tours.ToursQuerySortBy;
}
