import { Location } from '../Geo';

export interface MainMedia {
	square: Medium | null;
	videoPreview: Medium | null;
	portrait: Medium | null;
	landscape: Medium | null;
}

export interface Medium {
	original: Original;
	suitability: string[];
	urlTemplate: string;
	createdAt: string;
	source: Source;
	type: string;
	createdBy: string | null;
	url: string;
	quadkey: string | null;
	attribution: Attribution;
	guid: string;
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
	externalId: string;
}

export interface Original {
	size: number | null;
	width: number | null;
	height: number | null;
}
