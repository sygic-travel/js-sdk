export function create(apiUrl: string, clientKey: string): StSDK;

declare class ChangesModule {
	public initializeChangesWatching(tickInterval: number): Promise<void>;
	public stopChangesWatching(): void;
	public setChangesCallback(callback: (changeNotifications: Changes.ChangeNotification[]) => any | null): void;
}

declare class CollaborationModule {
	public followTrip(tripId: string): Promise<void>;
	public unfollowTrip(tripId: string): Promise<void>;
	public addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void>;
	public getTripCollaborations(tripId: string): Promise<Trips.Collaboration[]>;
	public removeTripCollaboration(collaborationId: string): Promise<void>;
	public acceptTripCollaboration(collaborationId: string, hash: string): Promise<string>;
	public resendInvitation(collaborationId: string): Promise<void>;
	public updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void>
}

declare class CollectionsModule {
	public getCollection(collectionId: number, photoSize: string): Promise<Collections.Collection>;
	public getCollections(
		filter: Collections.CollectionsFilterJSON,
		loadPlaces: boolean,
		photoSize: string
	): Promise<Collections.Collection[]>
}

declare class CustomPlacesModule {
	public createCustomPlace(data: Places.CustomPlaceFormData): Promise<Places.Place>;
	public updateCustomPlace(id: string, data: Places.CustomPlaceFormData): Promise<Places.Place>
	public deleteCustomPlace(id: string): Promise<void>;
}

declare class FavoritesModule {
	public addPlaceToFavorites(id: string): Promise<void>;
	public addCustomPlaceToFavorites(name: string, location: Location, address: string): Promise<string>;
	public getFavoritesIds(): Promise<string[]>;
	public removePlaceFromFavorites(id: string): Promise<void>;
}

declare class ForecastModule {
	public getDestinationWeather(destinationId: string): Promise<Forecast.Forecast[]>
}

declare class HotelsModule {
	public getHotels(filter: Hotels.HotelsFilterJSON): Promise<Hotels.AvailableHotels>
}

declare class PlacesModule {
	public getPlaces(filter: Places.PlacesListFilterJSON): Promise<Places.Place[]>;
	public getPlaceDetailed(id: string, photoSize: string): Promise<Places.Place>;
	public getPlacesDetailed(ids: string[], photoSize: string): Promise<Places.Place[]>;
	public getPlaceMedia(id: string): Promise<Media.Medium[]>;
	public getPlacesStats(filter: Places.PlacesStatsFilterJSON): Promise<Places.PlacesStats>;
	public getPlaceGeometry(id: string): Promise<Places.PlaceGeometry>;
	public getPlaceOpeningHours(id: string, from: string, to: string): Promise<Places.PlaceOpeningHours>
	public detectParentsByBounds(bounds: Geo.Bounds, zoom: number): Promise<Places.Place[]>
	public detectParentsByLocation(location: Location): Promise<Places.Place[]>
	public addPlaceReview(placeId: string, rating: number, message: string): Promise<Places.PlaceReview>
	public deletePlaceReview(reviewId: number): Promise<void>;
	public getPlaceReviews(placeId: string, limit: number, page: number): Promise<Places.PlaceReviewsData>;
	public voteOnReview(reviewId: number, voteValue: number): Promise<void>;
	public spreadPlacesOnMap(
		places: Places.Place[],
		bounds: Geo.Bounds,
		canvas: Spread.CanvasSize,
		sizesConfig?: Spread.SpreadSizeConfig[]
	): Spread.SpreadResult;
	public spreadPlacesOnMapV2(
		places: Places.Place[],
		vipPlaces: Places.Place[],
		bounds: Geo.Bounds,
		canvas: Spread.CanvasSize,
		sizesConfig?: SpreadV2.SpreadSizeConfig[],
		categoriesCoefficients?: SpreadV2.CategoriesCoefficients | null
	): SpreadV2.SpreadResult;
}

declare class RoutesModule {
	public getDirections(origin: Location, destination: Location): Promise<Route.Route>
}

declare class SearchModule {
	public search(query: string, location?: Location): Promise<Search.SearchResult[]>;
	public searchReverse(location: Location): Promise<Search.SearchResult[]>;
	public searchTags(query: string): Promise<Search.SearchTagsResult[]>;
}

declare class ToursModule {
	public getTours(toursQuery: Tours.ToursQuery): Promise<Tours.Tour[]>;
}

declare class TripModule {
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<Route.Route[]>;
	public getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<Trips.Trip[]>;
	public getTripsInTrash(): Promise<Trips.Trip[]>;
	public getTripDetailed(id: string): Promise<Trips.Trip>;
	public createTrip(startDate: string, name: string, placeId: string): Promise<Trips.Trip>;
	public updateTrip(id, dataToUpdate: Trips.TripUpdateData): Promise<Trips.Trip>;
	public cloneTrip(id): Promise<string>;
	public addDaysToTrip(id: string, count: number): Promise<Trips.Trip>;
	public prependDaysToTrip(id: string, count: number): Promise<Trips.Trip>;
	public removeDayFromTrip(id: string, dayIndex: number): Promise<Trips.Trip>;
	public swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trips.Trip>;
	public movePlaceInDay(id: string, dayIndex: number, positionFrom: number, positionTo: number): Promise<Trips.Trip>;
	public removePlacesFromDay(id: string, dayIndex: number, positionsInDay: number[]): Promise<Trips.Trip>;
	public removeAllPlacesFromDay(id: string, dayIndex: number): Promise<Trips.Trip>;
	public addPlaceToDay(tripId: string, placeId: string, dayIndex: number, positionInDay?: number): Promise<Trips.Trip>;
	public setOvernightPlace(tripId: string, placeId: string, dayIndex: number): Promise<Trips.Trip>;
	public setTransport(
		id: string,
		dayIndex: number,
		itemIndex: number,
		settings: Trips.TransportSettings
	): Promise<Trips.Trip>;
	public setTripConflictHandler(handler: null | Trips.TripConflictHandler): void;
	public emptyTripsTrash(): Promise<string[]>;
	public getTripTemplates(placeId: string): Promise<Trips.TripTemplate[]>
	public applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trips.Trip>;
}

declare class UserModule {
	public setUserSession(key: string | null, token: string | null): Promise<void>;
	public getUserSettings(): Promise<User.UserSettings>;
	public updateUserSettings(settings: User.UserSettings): Promise<User.UserSettings>;
}

declare class UtilityModule {
	public locationToMapTileKey(location: Location, zoom: number): string;
}

export class StSDK {
	public changes: ChangesModule;
	public collaboration: CollaborationModule;
	public collections: CollectionsModule;
	public customPlaces: CustomPlacesModule;
	public favorites: FavoritesModule;
	public forecast: HotelsModule;
	public hotels: HotelsModule;
	public places: PlacesModule;
	public routes: RoutesModule;
	public search: SearchModule;
	public tours: ToursModule;
	public trip: TripModule;
	public user: UserModule;
	public utility: UtilityModule;
}

export namespace Places {
	export interface Place {
		id: string;
		level: string;
		categories: string[];
		rating: number;
		quadkey: string;
		location: Location;
		boundingBox: Geo.Bounds | null;
		name: string;
		nameSuffix: string | null;
		perex: string | null;
		url: string;
		thumbnailUrl: string | null;
		marker: string;
		parents: string[];
		starRating: number | null;
		starRatingUnofficial: number | null;
		customerRating: number | null;
		detail: PlaceDetail | null;
	}

	export interface CustomPlaceFormData {
		name: string;
		location: Location;
		address?: string;
		description?: string;
		phone?: string;
		email?: string;
		opening_hours?: string;
		admission?: string;
	}

	export interface PlacesListFilterJSON {
		query?: string;
		mapTiles?: string[];
		mapSpread?: number;
		categories?: string[];
		categoriesOperator?: LogicalOperator;
		tags?: string[];
		tagsOperator?: LogicalOperator;
		parents?: string[];
		parentsOperator?: LogicalOperator;
		levels?: string[];
		limit?: number;
		bounds?: Geo.Bounds;
		zoom?: number;
	}

	export interface PlacesStatsFilterJSON {
		query?: string;
		mapTiles?: string[];
		mapTileBounds?: string[];
		categories?: string[];
		categoriesOperator?: LogicalOperator;
		tags?: string[];
		tagsOperator?: LogicalOperator;
		parents?: string[];
		parentsOperator?: LogicalOperator;
		levels?: string[];
		bounds?: Geo.Bounds;
		zoom?: number;
	}

	export enum LogicalOperator {
		AND,
		OR
	}

	export interface PlaceDetail {
		tags: Tag[];
		address: string | null;
		admission: string | null;
		duration: number | null;
		description: Description | null;
		email: string | null;
		openingHours: string | null;
		phone: string | null;
		media: Media.MainMedia;
		references: Reference[];
		/**
		 * @experimental
		 */
		ownerId?: string;
	}

	export interface Reference {
		id: number;
		title: string;
		type: string;
		languageId: string | null;
		url: string;
		supplier: string | null;
		priority: number;
		currency: string | null;
		price: number | null;
		flags: string[];
	}

	export interface Tag {
		key: string;
		name: string;
	}

	export interface Description {
		text: string;
		provider: string | null;
		translationProvider: string | null;
		link: null | null;
		isTranslated: boolean;
	}

	export interface PlaceGeometry {
		geometry: GeoJSON.GeoJsonObject | null;
		isShape: boolean;
	}

	export interface PlaceOpeningHours {
		[dayDate: string]: DayOpeningHours[];
	}

	export interface DayOpeningHours {
		opening: string;
		closing: string;
		note: string | null;
	}

	export interface PlaceReview {
		id: number;
		userId: string;
		userName: string;
		itemGuid: string;
		message: string | null;
		rating: number | null;
		votesUp: number;
		votesDown: number;
		votesScore: number;
		currentUserVote: number;
		createdAt: string;
		updatedAt: string | null;
	}

	export interface PlaceReviewsData {
		rating: number;
		currentUserHasReview: boolean;
		reviews: PlaceReview[];
	}

	export interface SumStatistic {
		name: string;
		key: string;
		count: number;
	}

	export interface PlacesStats {
		categories: SumStatistic[];
		tags: SumStatistic[];
	}
}

export namespace Hotels {
	export interface Hotel {
		place: Places.Place;
		bookingCom: {
			price: number;
			hotelId: string;
		};
	}

	export interface AvailableHotels {
		hotels: Hotel[];
		hotelFacilities: Places.Tag[];
		roomFacilities: Places.Tag[];
	}

	export interface HotelsFilterJSON {
		checkIn: string;
		checkOut: string;
		adults: number;
		children?: number[] | null;
		maxPrice?: number | null;
		minPrice?: number | null;
		minReviewScore?: number | null;
		placeIds?: string[] | null;
		bounds?: Geo.Bounds | null;
		mapTileBounds?: string[] | null;
		stars?: number[] | null;
		currency?: string | null;
		propertyTypes?: string[] | null;
		hotelFacilities?: string[] | null;
		roomFacilities?: string[] | null;
		limit?: number;
		zoom?: number;
	}
}

export namespace Geo {
	export interface Bounds {
		south: number;
		west: number;
		north: number;
		east: number;
	}

	export interface Location {
		lat: number;
		lng: number;
	}

	export interface Coordinate {
		x: number;
		y: number;
	}
}

export namespace Media {
	export type mediaType =
		'photo' |
		'photo360' |
		'video' |
		'video360';

	export type mediaSuitability =
		'portrait' |
		'landscape' |
		'square' |
		'video_preview';

	export interface MainMedia {
		square: Medium | null;
		videoPreview: Medium | null;
		portrait: Medium | null;
		landscape: Medium | null;
	}

	export interface Medium {
		original: Original;
		suitability: mediaSuitability[];
		urlTemplate: string;
		createdAt: string;
		source: Source;
		type: mediaType;
		createdBy: string;
		url: string;
		quadkey: string | null;
		attribution: Attribution;
		id: string;
		location: Location | null;
	}

	export interface Attribution {
		titleUrl: string | null;
		license: string | null;
		other: string | null;
		authorUrl: string | null;
		author: string | null;
		title: string | null;
		licenseUrl: string | null;
	}

	export interface Source {
		provider: string;
		name: string | null;
		externalId: string | null;
	}

	export interface Original {
		size: number | null;
		width: number | null;
		height: number | null;
	}
}

export namespace Spread {
	export interface SpreadSizeConfig {
		radius: number;
		margin: number;
		name: string;
		photoRequired?: boolean;
		minimalRating?: number;
	}

	export interface CanvasSize {
		width: number;
		height: number;
	}

	export interface SpreadResult {
		visible: SpreadedPlace[];
		hidden: Places.Place[];
	}

	export interface SpreadedPlace {
		place: Places.Place;
		coordinate: Geo.Coordinate;
		size: SpreadSizeConfig;
	}
}

export namespace SpreadV2 {
	export interface SpreadSizeConfig {
		radius: number;
		margin: number;
		name: string;
		photoRequired: boolean;
		zoomLevelLimits: number[];
		disabledCategories: string[];
	}

	export interface SpreadResult {
		visible: SpreadedPlace[];
		hidden: Places.Place[];
	}

	export interface SpreadedPlace {
		place: Places.Place;
		coordinate: Geo.Coordinate;
		size: SpreadSizeConfig;
	}

	export interface CategoriesCoefficients {
		noCategory: number;
		discovering: number;
		eating: number;
		goingOut: number;
		hiking: number;
		playing: number;
		relaxing: number;
		shopping: number;
		sightseeing: number;
		sleeping: number;
		doingSports: number;
		traveling: number;
	}
}

export namespace Trips {
	export interface Trip {
		id: string;
		ownerId: string;
		privacyLevel: string;
		name: string | null;
		version: number;
		startsOn: string | null;
		updatedAt: string;
		isDeleted: boolean;
		endsOn: string | null;
		url: string;
		days: Day[] | null;
		media: TripMedia;
		privileges: TripPrivileges;
	}

	export interface Day {
		note: string | null;
		itinerary: ItineraryItem[];
		date: string | null;
	}

	export type TripConflictClientResolution = 'server' | 'local';

	export type TripConflictHandler = (conflictInfo: TripConflictInfo, trip: Trip) =>
		Promise<TripConflictClientResolution>;

	export interface TripConflictInfo {
		lastUserName: string;
		lastUpdatedAt: string;
	}

	export interface ItineraryItem {
		place: Places.Place | null;
		placeId: string;
		startTime: number | null; // Number of seconds from midnight.
		duration: number | null; // Time in seconds planned to spend visiting place.
		note: string | null;
		isSticky: boolean | null; // https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
		transportFromPrevious: TransportSettings | null;

	}

	export interface TransportSettings {
		mode: TransportMode;
		type: TransportType;
		avoid: TransportAvoid[];
		startTime: number | null; // Number of seconds from midnight.
		duration: number | null; // Time in seconds spent on the transport.
		note: string | null;
		waypoints: Location[];
	}

	export interface TripPrivileges {
		edit: boolean;
		manage: boolean;
		delete: boolean;
	}

	export interface TripMedia {
		square: {
			id: string;
			urlTemplate: string;
		} | null;
		landscape: {
			id: string;
			urlTemplate: string;
		} | null;
		portrait: {
			id: string;
			urlTemplate: string;
		} | null;
		videoPreview: {
			id: string;
			urlTemplate: string;
		} | null;
	}

	export interface Collaboration {
		id: number;
		userName: string | null;
		userEmail: string;
		userPhotoUrl: string | null;
		accepted: boolean;
		accessLevel: string;
		createdAt: string;
		updatedAt: string | null;
		tripId: string;
	}

	export type TransportMode = 'car' |
		'pedestrian' |
		'bike' |
		'plane' |
		'bus' |
		'train' |
		'boat';

	export type TransportType = 'fastest' |
		'shortest' |
		'economic';

	export type TransportAvoid = 'tolls' |
		'highways' |
		'ferries' |
		'unpaved';

	export interface TripUpdateData {
		name?: string;
		startsOn?: string;
		privacyLevel?: string;
		isDeleted?: boolean;
	}

	export interface TripTemplate {
		id: number;
		description: string;
		duration: number | null;
		trip: Trips.Trip;
	}
}

export namespace Route {
	export interface Route {
		origin: Location;
		destination: Location;
		chosenDirection: Direction;
		modeDirections: ModeDirections[];
	}

	export interface Direction {
		distance: number;
		duration: number;
		polyline: string;
		mode: Trips.TransportMode;
		type: Trips.TransportType;
		avoid: Trips.TransportAvoid[];
		source: DirectionSource;
		isoCodes: string[];
	}

	export interface ModeDirections {
		mode: Trips.TransportMode;
		directions: Direction[];
	}

	export interface RouteRequest {
		origin: Location;
		destination: Location;
		waypoints?: Location[];
		avoid: Trips.TransportAvoid[];
		type: Trips.TransportType;
		chosenMode: Trips.TransportMode;
	}

	export type DirectionSource =
		'osrm' |
		'estimator' |
		'lbs';
}

export namespace Search {
	export interface Address {
		full: string;
		short: string;
		fields: AddressFields;
	}

	export interface AddressFields {
		name: string | null;
		houseNumber: string | null;
		street: string | null;
		city: string | null;
		state: string | null;
		postalCode: string | null;
		country: string | null;
	}

	export interface SearchResult {
		location: Location;
		type: string | null;
		address: Address | null;
		distance: number | null;
		place: Places.Place | null;
	}

	export interface SearchTagsResult extends Places.Tag {
		priority: number;
		isVisible: boolean;
	}
}

export namespace Forecast {
	export interface Forecast {
		date: string;
		temp: ForecastTemperature;
		weather: ForecastWeather;
		sunrise: string;
		sunset: string;
	}

	export interface ForecastTemperature {
		min: number;
		max: number;
	}

	export interface ForecastWeather {
		id: number;
		name: string;
		description: string;
		iconId: string;
	}
}

export namespace User {
	export interface UserSettings {
		homePlaceId: string | null;
		workPlaceId: string | null;
	}
}

export namespace Changes {
	export interface ChangeNotification {
		id: string | null;
		type: 'trip' | 'favorite' | 'settings';
		change: 'updated' | 'deleted';
	}
}

export namespace Tours {
	export interface Tour {
		id: string;
		supplier: string;
		title: string;
		perex: string;
		url: string;
		rating: number;
		reviewCount: number;
		photoUrl: string;
		price: number;
		originalPrice: number;
		duration: string;
	}

	export interface ToursQuery {
		destinationId: string;
		page?: number;
		sortBy?: ToursQuerySortBy;
		sortDirection?: ToursQueryDirection;
	}

	export type ToursQueryDirection = 'asc' | 'desc';
	export type ToursQuerySortBy = 'price' | 'rating' | 'top_sellers' ;
}

export namespace Collections {
	export interface Collection {
		id: number;
		nameLong: string;
		nameShort: string | null;
		description: string | null;
		tags: Places.Tag[];
		places: Places.Place[];
		placeIds: string[];
	}

	export interface CollectionsFilterJSON {
		placeId?: string;
		containedPlaceIds?: string[];
		tags?: string[];
		tagsNot?: string[];
		query?: string;
		limit?: number;
		offset?: number;
	}
}
