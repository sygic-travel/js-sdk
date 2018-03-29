export function create(settings: Settings): StSDK;

declare class ChangesModule {
	public initializeChangesWatching(tickInterval: number): Promise<void>;
	public stopChangesWatching(): void;
}

declare class CollaborationModule {
	public followTrip(tripId: string): Promise<void>;
	public unfollowTrip(tripId: string): Promise<void>;
	public addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void>;
	public getTripCollaborations(tripId: string): Promise<Trips.Collaboration[]>;
	public removeTripCollaboration(collaborationId: string): Promise<void>;
	public acceptTripCollaboration(collaborationId: string, hash: string): Promise<string>;
	public resendInvitation(collaborationId: string): Promise<void>;
	public updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void>;
}

declare class CollectionsModule {
	public getCollection(collectionId: number, photoSize: string): Promise<Collections.Collection>;
	public getCollections(
		filter: Collections.CollectionsFilterJSON,
		loadPlaces: boolean,
		photoSize: string
	): Promise<Collections.Collection[]>;
}

declare class CustomPlacesModule {
	public createCustomPlace(data: Places.CustomPlaceFormData): Promise<Places.Place>;
	public updateCustomPlace(id: string, data: Places.CustomPlaceFormData): Promise<Places.Place>;
	public deleteCustomPlace(id: string): Promise<void>;
}

declare class EventsModule {
	public setSessionExpiredHandler(handler: () => any): void;
	public setTripUpdateConflictHandler(handler: (conflictInfo: Trips.TripConflictInfo, trip: Trips.Trip) => any): void;
	public setSynchronizationHandler(handler: (changes: Changes.ChangeNotification[]) => any): void;
}

declare class FavoritesModule {
	public addPlaceToFavorites(id: string): Promise<void>;
	public addCustomPlaceToFavorites(name: string, location: Geo.Location, address: string): Promise<string>;
	public getFavoritesIds(): Promise<string[]>;
	public removePlaceFromFavorites(id: string): Promise<void>;
}

declare class ForecastModule {
	public getDestinationWeather(destinationId: string): Promise<Forecast.Forecast[]>;
}

declare class FlightsModule {
	public getFlights(query: Flights.FlightsQuery): Promise<Flights.FlightSearchResult[]>;
}

declare class HotelsModule {
	public getHotels(filter: Hotels.HotelsFilterJSON): Promise<Hotels.AvailableHotels>;
}

declare class PdfModule {
	public getPdfData(query: Pdf.PdfQuery): Promise<Pdf.PdfData>;
	public generatePdf(tripId: string): Promise<Pdf.GeneratingState>;
}

declare class PlacesModule {
	public getPlaces(filter: Places.PlacesListFilterJSON): Promise<Places.Place[]>;
	public getDetailedPlace(id: string, photoSize: string): Promise<Places.Place>;
	public getDetailedPlaces(ids: string[], photoSize: string): Promise<Places.Place[]>;
	public getPlaceMedia(id: string): Promise<Media.Medium[]>;
	public getPlacesStats(filter: Places.PlacesStatsFilterJSON): Promise<Places.PlacesStats>;
	public getPlaceGeometry(id: string): Promise<Places.PlaceGeometry>;
	public getPlaceOpeningHours(id: string, from: string, to: string): Promise<Places.PlaceOpeningHours>;
	public detectParentsByBounds(bounds: Geo.Bounds, zoom: number): Promise<Places.Place[]>;
	public detectParentsByLocation(location: Geo.Location): Promise<Places.Place[]>;
	public addPlaceReview(placeId: string, rating: number, message: string): Promise<Places.PlaceReview>;
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
		categoriesCoefficients?: SpreadV2.CategoriesCoefficients | null,
		useLocalRating?: boolean
	): SpreadV2.SpreadResult;
}

declare class RoutesModule {
	public getDirections(
		origin: Geo.Location,
		destination: Geo.Location,
		waypoints: Route.Waypoint[],
		avoids: Trips.TransportAvoid[]
	): Promise<Route.Route>;
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<Route.TripDayRoutes>;
	public sendDirections(
		email: string,
		destinationLocation: Location,
		destinationName: string | null
	): Promise<Route.DirectionSendResponseCode>;
}

declare class SearchModule {
	public search(query: string, location?: Geo.Location): Promise<Search.SearchResult[]>;
	public searchReverse(location: Geo.Location): Promise<Search.SearchResult[]>;
	public searchTags(query: string): Promise<Search.SearchTagsResult[]>;
}

declare class ToursModule {
	public getToursViator(toursQuery: Tours.ToursViatorQuery): Promise<Tours.Tour[]>;
	public getToursGetYourGuide(toursQuery: Tours.ToursGetYourGuideQuery): Promise<Tours.Tour[]>;
	public getGetYourGuideTagStats(toursQuery: Tours.ToursGetYourGuideQuery): Promise<Tours.ToursTagStats[]>;
}

declare class TripModule {
	public getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<Trips.TripInfo[]>;
	public getTripsInTrash(): Promise<Trips.TripInfo[]>;
	public getTripDetailed(id: string): Promise<Trips.Trip>;
	public getTripEditor(): Trips.TripEditor;
	public saveTrip(trip: Trips.Trip): Promise<Trips.Trip>;
	public cloneTrip(id: string): Promise<string>;
	public ensureTripSyncedToServer(tripId: string): Promise<void>;
	public emptyTripsTrash(): Promise<string[]>;
	public getTripTemplates(placeId: string): Promise<Trips.TripTemplate[]>;
	public applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trips.Trip>;
}

declare class SessionModule {
	public setSession(session: Sessions.Session | null): Promise<void>;
	public getSession(): Promise<Sessions.Session | null>;
	public getUserSettings(): Promise<Sessions.UserSettings>;
	public updateUserSettings(settings: Sessions.UserSettings): Promise<Sessions.UserSettings>;
	public signInWithDeviceId(deviceId: string, devideCode: string): Promise<Sessions.AuthenticationResponseCode>;
	public signInWithJwtToken(
		jwt: string,
		deviceId?: string,
		devideCode?: string
	): Promise<Sessions.AuthenticationResponseCode>;
	public signInWithCredentials(
		email: string,
		password: string,
		deviceId?: string,
		devideCode?: string
	): Promise<Sessions.AuthenticationResponseCode>;
	public register(email: string, password: string, name: string): Promise<Sessions.RegistrationResponseCode>;
	public requestCancelAccount(): Promise<void>;
	public deleteAccount(id: string, hash: string): Promise<void>;
	public signInWithFacebookAccessToken(
		accessToken: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<Sessions.AuthenticationResponseCode>;
	public signInWithGoogleIdToken(
		accessToken: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<Sessions.AuthenticationResponseCode>;
	public getUserInfo(): Promise<Sessions.UserInfo>;
	public resetPassword(email: string): Promise<Sessions.ResetPasswordResponseCode>;
}

declare class UtilityModule {
	public locationToMapTileKey(location: Geo.Location, zoom: number): string;
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
	public session: SessionModule;
	public utility: UtilityModule;
}

export namespace Places {
	export interface Place {
		id: string;
		level: Level;
		categories: Category[];
		rating: number;
		quadkey: string;
		location: Geo.Location;
		boundingBox: Geo.Bounds | null;
		name: string;
		nameSuffix: string | null;
		originalName: string | null;
		perex: string | null;
		url: string | null;
		thumbnailUrl: string | null;
		marker: string;
		parentIds: string[];
		starRating: number | null;
		starRatingUnofficial: number | null;
		customerRating: number | null;
		detail: Detail | null;
	}

	export enum Level {
		CONTINENT = 'continent',
		COUNTRY = 'country',
		STATE = 'state',
		REGION = 'region',
		COUNTY = 'county',
		CITY = 'city',
		TOWN = 'town',
		VILLAGE = 'village',
		SETTLEMENT = 'settlement',
		LOCALITY = 'locality',
		NEIGHBOURHOOD = 'neighbourhood',
		ARCHIPELAGO = 'archipelago',
		ISLAND = 'island',
		POI = 'poi' ,
	}

	export enum Category {
		DISCOVERING = 'discovering',
		EATING = 'eating',
		GOING_OUT = 'going_out',
		HIKING = 'hiking',
		PLAYING = 'playing',
		RELAXING = 'relaxing',
		SHOPPING = 'shopping',
		SIGHTSEEING = 'sightseeing',
		SLEEPING = 'sleeping',
		DOING_SPORTS = 'doing_sports',
		TRAVELING = 'traveling',
	}

	export interface CustomPlaceFormData {
		name: string;
		location: Geo.Location;
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

	export interface Detail {
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
		mediaCount: number;
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
		provider: DescriptionProvider | null;
		translationProvider: TranslationProvider | null;
		url: string | null;
	}

	export enum DescriptionProvider {
		WIKIPEDIA = 'wikipedia',
		WIKIVOYAGE = 'wikivoyage',
	}

	export enum TranslationProvider {
		GOOGLE,
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
		placeId: string;
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
			availableRoomsCount: number;
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
	export interface MainMedia {
		square: Medium | null;
		videoPreview: Medium | null;
		portrait: Medium | null;
		landscape: Medium | null;
	}

	export interface Medium {
		original: Original;
		suitability: Suitability[];
		urlTemplate: string;
		urlWithSize: string;
		type: Type;
		url: string;
		attribution: Attribution;
		id: string;
		location: Geo.Location | null;
	}

	export enum Type {
		PHOTO = 'photo',
		PHOTO_360 = 'photo_360',
		VIDEO = 'video',
		VIDEO_360 = 'video_360'
	}

	export enum Suitability {
		PORTRAIT = 'portrait',
		LANDSCAPE = 'landscape',
		SQUARE = 'square',
		VIDEO_PREVIEW = 'video_preview'
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
	export interface TripInfo {
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
		media: TripMedia;
		privileges: TripPrivileges;
	}

	export interface Trip extends Trips.TripInfo {
		days: Day[] | null;
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

	export interface TripEditor {
		addDaysToTrip(
			trip: Trip,
			appendCount: number,
			prependCount: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		removeDay(trip: Trip, dayIndex: number, userSettings: Sessions.UserSettings | null): Trip;
		swapDaysInTrip(
			trip: Trip,
			firstDayIndex: number,
			secondDayIndex: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		addPlaceToDay(
			trip: Trip,
			place: Places.Place,
			dayIndex: number,
			userSettings: Sessions.UserSettings | null,
			positionInDay?: number // If not passed the place is added to the end
		): Trip;
		duplicatePlace(
			trip: Trip,
			dayIndex: number,
			placeIndex: number,
			resetTransport: boolean,
			userSettings: Sessions.UserSettings | null
		): Trip;
		movePlaceInDay(
			trip: Trip,
			dayIndex: number,
			positionFrom: number,
			positionTo: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		removePlacesFromDay(
			trip: Trip,
			dayIndex: number,
			positionsInDay: number[],
			userSettings: Sessions.UserSettings | null
		): Trip;
		removeAllPlacesFromDay(
			tripToBeUpdated: Trip,
			dayIndex: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		addOrReplaceOvernightPlace(
			trip: Trip,
			place: Places.Place,
			dayIndex: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		removePlaceFromDayByPlaceId(
			trip: Trip,
			placeId: string,
			dayIndex: number,
			userSettings: Sessions.UserSettings | null
		): Trip;
		setTransport(
			trip: Trip,
			dayIndex: number,
			itemIndex: number,
			settings: TransportSettings | null
		): Trip;
		updatePlaceUserData(
			trip: Trip,
			dayIndex: number,
			itemIndex: number,
			startTime: number | null,
			duration: number | null,
			note: string | null
		): Trip;
		updateDayNote(trip: Trip, dayIndex: number, note: string): Trip;
		smartAddPlaceToDay(
			trip: Trip,
			placeId: string,
			dayIndex: number,
			positionInDay?: number // If not passed automatic algorithm is used
		): Promise<Trip>;
		smartAddSequenceToDay(
			trip: Trip,
			dayIndex: number,
			placeIds: string[],
			transports?: (TransportSettings | null)[],
			positionInDay?: number // If not passed automatic algorithm is used
		): Promise<Trip>;
		createTrip(startDate: string, name: string, daysCount: number, placeId?: string): Promise<Trip>;
		setStartDate(trip: Trip, startDate: string): Trip;
	}

	export interface ItineraryItem {
		place: Places.Place | null;
		placeId: string;
		startTime: number | null; // Number of seconds from midnight.
		duration: number | null; // Time in seconds planned to spend visiting place.
		note: string | null;
		isSticky: boolean | null; // https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
		isStickyFirstInDay: boolean | null; // https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
		isStickyLastInDay: boolean | null; // https://confluence.sygic.com/display/STV/Sticky+Places+in+Itinerary
		transportFromPrevious: TransportSettings | null;

	}

	export interface TransportSettings {
		mode: TransportMode;
		type: TransportType;
		avoid: TransportAvoid[];
		startTime: number | null; // Number of seconds from midnight.
		duration: number | null; // Time in seconds spent on the transport.
		note: string | null;
		waypoints: Geo.Location[];
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
		'boat' |
		'public_transit';

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
	export interface TripDayRoutes {
		routes: Route[];
		isExplicitFlags: boolean[];
	}

	export interface Route {
		origin: Geo.Location;
		destination: Geo.Location;
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
		origin: Geo.Location;
		destination: Geo.Location;
		waypoints?: Geo.Location[];
		avoid: Trips.TransportAvoid[];
		type: Trips.TransportType;
		chosenMode: Trips.TransportMode;
	}

	export type DirectionSource =
		'osrm' |
		'estimator' |
		'lbs';

	export interface Waypoint {
		placeId: string | null;
		location: Geo.Location;
	}

	export enum DirectionSendResponseCode {
		OK = 'OK',
		ERROR_INVALID_INPUT = 'ERROR_INVALID_INPUT',
		ERROR = 'ERROR'
	}
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
		location: Geo.Location;
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

export namespace Sessions {
	export interface UserSettings {
		homePlaceId: string | null;
		workPlaceId: string | null;
	}
	export interface Session {
		accessToken: string;
		refreshToken: string;
	}
	export interface UserInfo {
		id: string;
		name: string | null;
		email: string | null;
		roles: string[];
		dateCreated: string;
		isEmailSubscribed: boolean;
		isRegistered: boolean;
		photoUrl: string | null;
		licence: UserLicence | null;
	}
	export interface UserLicence {
		isActive: boolean;
		name: string;
		expirationAt: string | null;
	}

	export type AuthenticationResponseCode = 'OK' | 'ERROR_INVALID_CREDENTIALS' | 'ERROR';
	export type RegistrationResponseCode = 'OK' |
		'ERROR_ALREADY_REGISTERED' |
		'ERROR_EMAIL_INVALID_FORMAT' |
		'ERROR_PASSWORD_MIN_LENGTH';

	export enum ResetPasswordResponseCode {
		OK = 'OK',
		ERROR_USER_NOT_FOUND = 'ERROR_USER_NOT_FOUND',
		ERROR_EMAIL_INVALID_FORMAT = 'ERROR_EMAIL_INVALID_FORMAT',
		ERROR = 'ERROR'
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
		duration: string | null;
		durationMin: number | null;
		durationMax: number | null;
		flags: string[];
	}

	export enum ToursViatorQuerySortBy {
		PRICE = 'price',
		RATING = 'rating',
		TOP_SELLERS = 'top_sellers'
	}

	export enum ToursGetYourGuideQuerySortBy {
		PRICE = 'price',
		RATING = 'rating',
		DURATION = 'duration',
		POPULARITY = 'top_sellers'
	}

	export interface ToursViatorQuery {
		parentPlaceId: string;
		page: number | null;
		sortBy: ToursViatorQuerySortBy | null;
		sortDirection: ToursQueryDirection | null;
	}

	export interface ToursGetYourGuideQuery {
		query: string | null;
		bounds: Geo.Bounds | null;
		parentPlaceId: string | null;
		page: number | null;
		tags: number[];
		count: number | null;
		startDate: string | null;
		endDate: string | null;
		durationMin: number | null;
		durationMax: number | null;
		sortBy: ToursGetYourGuideQuerySortBy | null;
		sortDirection: ToursQueryDirection | null;
	}

	export interface ToursTagStats {
		id: number;
		name: string;
		count: number;
	}

	export enum ToursQueryDirection {
		ASC = 'asc',
		DESC = 'desc'
	}
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

export interface Settings {
	stApiUrl?: string;
	ssoApiUrl?: string;
	ssoClientId?: string;
	integratorApiKey?: string;
}

export namespace Flights {
	export interface FlightSearchResult {
		price: number;
		currency: string;
		deepLink: string;
		outbound: Flight;
		inbound: Flight | null;
	}

	export interface Airport {
		location: Geo.Location;
		name: string;
		cityName: string;
		iata: string;
	}

	export interface Flight {
		origin: Airport;
		destination: Airport;
		routes: Route[];
		duration: number;
	}

	export interface Route {
		origin: Airport;
		destination: Airport;
		flightNo: number;
		airline: Airline;
		departureTime: Date;
		arrivalTime: Date;
		polyline: string;
		stopOver: number | null;
	}

	export interface FlightsQuery {
		origin: Geo.Location;
		destination: Geo.Location;
		date: string;
		returnDate: string;
		currency?: string;
		language?: string;
		adults?: number;
		infants?: number;
	}

	export interface Airline {
		name: string;
		logo: string;
		id: string;
	}
}

export namespace Pdf {
	export interface PdfQuery {
		tripId: string;
		mainMapWidth: number;
		mainMapHeight: number;
		gridRowsCount: number;
		gridColumnsCount: number;
		secondaryMapWidth: number;
		secondaryMapHeight: number;
	}

	export interface PdfData {
		destinations: PdfDestination[];
		routes: Route.TripDayRoutes[];
	}

	export interface PdfDestination {
		destination: Places.Place;
		mainMap: PdfStaticMap | null;
		secondaryMaps: PdfStaticMap[];
		places: Places.Place[];
	}

	export interface PdfStaticMapSector {
		id: string;
		bounds: Geo.Bounds;
		places: Places.Place[];
	}

	export interface PdfStaticMap extends StaticMap {
		id: string;
		sectors: PdfStaticMapSector[];
	}

	export interface StaticMap {
		url: string;
		bounds: Geo.Bounds;
	}

	export interface GeneratingState {
		generatingId: string;
		state: 'generating' | 'done' | 'not_found' | 'timeout';
		url: string | null;
	}
}
