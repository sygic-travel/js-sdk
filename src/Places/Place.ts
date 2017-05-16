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
	url: string;
	thumbnailUrl: string | null;
	price: Price | null;
	marker: string;
	parents: string[];
	detail: PlaceDetail | null;
}

export interface Price {
	value: number;
	savings: number;
}
