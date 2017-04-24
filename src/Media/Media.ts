import { Location } from '../Geo';

export interface MainMedia {
	square: Medium;
	videoPreview?: Medium;
	portrait: Medium;
	landscape: Medium;
}

export interface Medium {
	original: Original;
	suitability: string[];
	urlTemplate: string;
	createdAt: string;
	source: Source;
	type: string;
	createdBy: string;
	url: string;
	quadkey: string;
	attribution: Attribution;
	guid: string;
	location: Location;
}

export interface Attribution {
	titleUrl: string;
	license: string;
	other: string;
	authorUrl: string;
	author: string;
	title: string;
	licenseUrl: string;
}

export interface Source {
	provider: string;
	name: string;
	externalId: string;
}

export interface Original {
	size: number;
	width: number;
	height: number;
}
