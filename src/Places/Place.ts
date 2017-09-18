import { Location } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { PlaceDetail} from './PlaceDetail';

export interface Place {
	id: string;
	level: string;
	categories: string[];
	rating: number;
	quadkey: string;
	location: Location;
	boundingBox: Bounds | null;
	name: string;
	nameSuffix: string | null;
	perex: string | null;
	url: string | null;
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

export function isStickyByDefault(place: Place): boolean {
	return place.categories.indexOf('sleeping') !== -1;
}
