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
	boundingBox: Bounds;
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
