import { Location } from '../Geo';

export enum Type {
	PHOTO = 'photo',
	PHOTO_360 = 'photo_360',
	VIDEO = 'video',
	VIDEO_360 = 'video_360'
}

export enum Suitability {
	PORTRAIT = 'portrait',
	LANDSCAPE = 'landscape',
	SQUARE = 'square',
	VIDEO_PREVIEW = 'video_preview'
}

export enum License {
	CC_BY_SA_3 = 'cc_by_sa_3',
	CC_BY_SA_4 = 'cc_by_sa_4'
}

export interface MainMedia {
	square: Medium | null;
	videoPreview: Medium | null;
	portrait: Medium | null;
	landscape: Medium | null;
}

export interface Medium {
	original: Original;
	suitability: Suitability[];
	urlTemplate: string;
	urlWithSize: string;
	type: Type;
	url: string;
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

export interface Original {
	size: number | null;
	width: number | null;
	height: number | null;
}

export interface UploadMetadata {
	type: Type;
	url: string | null;
	attribution: Attribution;
}
