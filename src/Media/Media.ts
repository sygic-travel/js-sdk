import { Location } from '../Geo';

export type mediaType =
	'photo' |
	'photo360' |
	'video' |
	'video360';

export type mediaSuitability =
	'portrait' |
	'landscape' |
	'square' |
	'video_preview';

export interface MainMedia {
	square: Medium | null;
	videoPreview: Medium | null;
	portrait: Medium | null;
	landscape: Medium | null;
}

export interface Medium {
	original: Original;
	suitability: mediaSuitability[];
	urlTemplate: string;
	urlWithSize: string;
	createdAt: string;
	source: Source;
	type: mediaType;
	createdBy: string;
	url: string;
	quadkey: string | null;
	attribution: Attribution;
	id: string;
	location: Location | null;
}

export interface Attribution {
	titleUrl: string | null;
	license: string | null;
	other: string | null;
	authorUrl: string | null;
	author: string | null;
	title: string | null;
	licenseUrl: string | null;
}

export interface Source {
	provider: string;
	name: string | null;
	externalId: string | null;
}

export interface Original {
	size: number | null;
	width: number | null;
	height: number | null;
}
