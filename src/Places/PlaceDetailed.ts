import { Location } from '../Location/Location';
import { MainMedia, Media } from '../Media/Media';

export interface PlaceDetailed {
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
	thumbnailUrl: string;
	tags: Tag[];
	address: string;
	admission?: any;
	duration: number;
	email?: any;
	openingHours?: any;
	isDeleted: boolean;
	phone?: any;
	description: Description;
	media?: Media;
	references: Reference[];
}

export interface PlaceDetailedWithMainMedia extends PlaceDetailed {
	mainMedia?: MainMedia;
}

export interface Reference {
	id: number;
	title: string;
	type: string;
	languageId: string;
	url: string;
	offlineFile?: any;
	supplier: string;
	priority: number;
	isPremium: boolean;
	currency: string;
	price?: number;
	flags: any[];
}

export interface Tag {
	key: string;
	name: string;
}

export interface Description {
	text: string;
	provider?: any;
	translationProvider?: any;
	link?: any;
	isTranslated: boolean;
}
