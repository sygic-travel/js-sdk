export interface MainMedia {
	usage: Usage;
	media: Media[];
}

export interface Media {
	original: Original;
	suitability: string[];
	urlTemplate: string;
	createdAt: Date;
	source: Source;
	type: string;
	createdBy: string;
	url: string;
	quadkey?: any;
	attribution: Attribution;
	guid: string;
	location?: any;
}

export interface Attribution {
	titleUrl: string;
	license: string;
	other?: any;
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

export interface Usage {
	square: string;
	videoPreview?: any;
	portrait: string;
	landscape: string;
}
