import { Bounds, Location } from '../Geo';
import { Detail, Tag } from './PlaceDetail';

export interface Place {
	id: string;
	level: Level;
	categories: Category[];
	rating: number;
	ratingLocal: number;
	quadkey: string;
	location: Location;
	boundingBox: Bounds | null;
	name: string;
	nameSuffix: string | null;
	nameLocal: string | null;
	nameTranslated: string | null;
	nameEn: string | null;
	perex: string | null;
	url: string | null;
	thumbnailUrl: string | null;
	marker: string;
	class: PlaceClass;
	parents: Parent[];
	hotelStarRating: number | null;
	hotelStarRatingUnofficial: number | null;
	customerRating: number | null;
	tagKeys: string[];
	detail: Detail | null;
}

export interface DetailedPlace extends Place {
	detail: Detail;
}

export interface CustomPlaceFormData {
	name: string;
	location: Location;
	address?: string;
	description?: string;
	phone?: string;
	email?: string;
	opening_hours_note?: string;
	admission?: string;
}

export interface Parent {
	id: string;
	name: string | null;
	level: string | null;
}

export interface PlaceClass {
	slug: string;
	name: string | null;
}

export function isStickyByDefault(place: Place): boolean {
	return place.categories.indexOf(Category.SLEEPING) !== -1;
}

export function hasTag(key: string, detail: Detail): boolean {
	const found = detail.tags.find((tag: Tag) => tag.key === key);
	return !!found;
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
