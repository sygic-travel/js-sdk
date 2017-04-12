import { Location } from '../Geo/Location';

export interface Place {
	guid: string;
	level: string;
	rating: number;
	quadkey: string;
	location: Location;
	boundingBox?: any;
	name: string;
	nameSuffix: string;
	url: string;
	price?: any;
	marker: string;
	categories: string[];
	parentGuids: string[];
	perex: string;
	thumbnailUrl?: string;
}
