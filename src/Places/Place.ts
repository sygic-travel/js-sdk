import { Location } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { PlaceDetail} from './PlaceDetailed';

export interface Place {
	guid: string;
	level: string;
	rating: number;
	location: Location;
	quadkey: string;
	name: string;
	nameSuffix: string;
	boundingBox?: Bounds;
	perex: string;
	url: string;
	thumbnailUrl?: string;
	price?: any;
	marker: string;
	categories: string[];
	parents: string[];
	detail?: PlaceDetail;
}
