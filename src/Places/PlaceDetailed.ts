import { Location } from '../Geo/Location';
import { MainMedia, Media } from '../Media/Media';

export interface PlaceDetailedResponse {
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
	mainMedia?: MainMedia;
	references: Reference[];
}

export class PlaceDetailed {
	private _guid: string;
	private _level: string;
	private _rating: number;
	private _quadkey: string;
	private _location: Location;
	private _boundingBox?: any;
	private _name: string;
	private _nameSuffix: string;
	private _url: string;
	private _price?: any;
	private _marker: string;
	private _categories: string[];
	private _parentGuids: string[];
	private _perex: string;
	private _thumbnailUrl: string;
	private _tags: Tag[];
	private _address: string;
	private _admission?: any;
	private _duration: number;
	private _email?: any;
	private _openingHours?: any;
	private _isDeleted: boolean;
	private _phone?: any;
	private _description: Description;
	private _media?: Media;
	private _references: Reference[];

	private _defaultPhotoSize: string = '300x300';

	constructor(placeDetailedResponse: PlaceDetailedResponse, photoSize) {
		this._guid = placeDetailedResponse.guid;
		this._level = placeDetailedResponse.level;
		this._rating = placeDetailedResponse.rating;
		this._quadkey = placeDetailedResponse.quadkey;
		this._location = placeDetailedResponse.location;
		this._boundingBox = placeDetailedResponse.boundingBox;
		this._name = placeDetailedResponse.name;
		this._nameSuffix = placeDetailedResponse.nameSuffix;
		this._url = placeDetailedResponse.url;
		this._price = placeDetailedResponse.price;
		this._marker = placeDetailedResponse.marker;
		this._categories = placeDetailedResponse.categories;
		this._parentGuids = placeDetailedResponse.parentGuids;
		this._perex = placeDetailedResponse.perex;
		this._thumbnailUrl = placeDetailedResponse.thumbnailUrl;
		this._tags = placeDetailedResponse.tags;
		this._address = placeDetailedResponse.address;
		this._admission = placeDetailedResponse.admission;
		this._duration = placeDetailedResponse.duration;
		this._email = placeDetailedResponse.email;
		this._openingHours = placeDetailedResponse.openingHours;
		this._isDeleted = placeDetailedResponse.isDeleted;
		this._phone = placeDetailedResponse.phone;
		this._description = placeDetailedResponse.description;
		this._references = placeDetailedResponse.references;
		this._media = this.mapMainMediaToMedia(placeDetailedResponse.mainMedia, photoSize);
	}

	private mapMainMediaToMedia(mainMedia: MainMedia, photoSize: string): Media {
		const mappedMedia = {};
		if (mainMedia) {
			Object.keys(mainMedia.usage).forEach((key) => {
				const mediaGuid = mainMedia.usage[key];
				mappedMedia[key] = mainMedia.media.reduce((acc, item) => {
					if (item.guid === mediaGuid) {
						item.urlTemplate = item.urlTemplate.replace(/{size}/i, photoSize || this._defaultPhotoSize);
						return item;
					}
					return acc;
				}, null);
			});
		}

		return mappedMedia as Media;
	}

	get guid(): string {
		return this._guid;
	}

	get level(): string {
		return this._level;
	}

	get rating(): number {
		return this._rating;
	}

	get quadkey(): string {
		return this._quadkey;
	}

	get location(): Location {
		return this._location;
	}

	get boundingBox(): any {
		return this._boundingBox;
	}

	get name(): string {
		return this._name;
	}

	get nameSuffix(): string {
		return this._nameSuffix;
	}

	get url(): string {
		return this._url;
	}

	get price(): any {
		return this._price;
	}

	get marker(): string {
		return this._marker;
	}

	get categories(): string[] {
		return this._categories;
	}

	get parentGuids(): string[] {
		return this._parentGuids;
	}

	get perex(): string {
		return this._perex;
	}

	get thumbnailUrl(): string {
		return this._thumbnailUrl;
	}

	get tags(): Tag[] {
		return this._tags;
	}

	get address(): string {
		return this._address;
	}

	get admission(): any {
		return this._admission;
	}

	get duration(): number {
		return this._duration;
	}

	get email(): any {
		return this._email;
	}

	get openingHours(): any {
		return this._openingHours;
	}

	get isDeleted(): boolean {
		return this._isDeleted;
	}

	get phone(): any {
		return this._phone;
	}

	get description(): Description {
		return this._description;
	}

	get media(): Media {
		return this._media;
	}

	get references(): Reference[] {
		return this._references;
	}

	get defaultPhotoSize(): string {
		return this._defaultPhotoSize;
	}
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
