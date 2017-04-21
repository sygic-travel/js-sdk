export function create(apiUrl: string, clientKey: string): SdkBrowser;

export interface SdkBrowser {
	getPlaces(filter: Places.PlacesFilterJSON): Promise<Places.Place[]>;
	getPlaceDetailed(guid: string, photoSize: string): Promise<Places.Place>;
	getPlaceMedia(guid: string): Promise<Media.Medium[]>;
	spreadPlacesOnMap(
		places: Places.Place[],
		markerSizes: Spread.SpreadSizeConfig[],
		bounds: Geo.Bounds,
		canvas: Spread.CanvasSize
	): Spread.SpreadResult;
}

export namespace Places {
	export interface PlacesFilterJSON {
		query?: string;
		mapTile?: string;
		mapSpread?: number;
		categories?: string[];
		tags?: string[];
		parent?: string;
		level?: string;
		limit?: number;
		bounds?: Geo.Bounds;
		zoom?: number;
	}

	export interface Place {
		guid: string;
		level: string;
		rating: number;
		location: Geo.Location;
		quadkey: string;
		name: string;
		nameSuffix: string;
		boundingBox: Geo.Bounds;
		perex: string;
		url: string;
		thumbnailUrl: string;
		price: Price;
		marker: string;
		categories: string[];
		parents: string[];
		detail: PlaceDetail;
	}

	export interface Price {
		value: number;
		savings: number;
	}

	export interface PlaceDetail {
		tags: Tag[];
		address: string;
		admission: string;
		description: Description;
		email: string;
		duration: number;
		openingHours: string;
		phone: string;
		media: Media.MainMedia;
		references: Reference[];
	}

	export interface Reference {
		id: number;
		title: string;
		type: string;
		languageId: string;
		url: string;
		supplier: string;
		priority: number;
		currency: string;
		price: number;
		flags: string[];
	}

	export interface Tag {
		key: string;
		name: string;
	}

	export interface Description {
		text: string;
		provider: string;
		translationProvider: string;
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
		square: Medium;
		videoPreview?: Medium;
		portrait: Medium;
		landscape: Medium;
	}

	export interface Medium {
		original: Original;
		suitability: string[];
		urlTemplate: string;
		createdAt: string;
		source: Source;
		type: string;
		createdBy: string;
		url: string;
		quadkey: string;
		attribution: Attribution;
		guid: string;
		location: Geo.Location;
	}

	export interface Attribution {
		titleUrl: string;
		license: string;
		other: string;
		authorUrl: string;
		author: string;
		title: string;
		licenseUrl: string;
	}

	export interface Source {
		provider: string;
		name: string;
		externalId: string;
	}

	export interface Original {
		size: number;
		width: number;
		height: number;
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

	interface SpreadedPlace {
		place: Places.Place;
		coordinate: Geo.Coordinate;
		size: SpreadSizeConfig;
	}
}
