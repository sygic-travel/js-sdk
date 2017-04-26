import { Location } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { PlaceDetail} from './PlaceDetail';

export interface Place {
	guid: string;
	level: string;
	rating: number;
	location: Location;
	quadkey: string;
	name: string;
	nameSuffix: string;
	boundingBox: Bounds | null;
	perex: string | null;
	url: string;
	thumbnailUrl: string | null;
	price: Price | null;
	marker: string;
	categories: string[];
	parents: string[];
	detail: PlaceDetail | null;
}

export interface Price {
	value: number;
	savings: number;
}
