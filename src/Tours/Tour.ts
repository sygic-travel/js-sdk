import { Bounds } from '../Geo';

export interface Tour {
	id: string;
	supplier: string;
	title: string;
	perex: string;
	url: string;
	rating: number;
	reviewCount: number;
	photoUrl: string;
	price: number;
	originalPrice: number;
	duration: string | null;
	durationMin: number | null;
	durationMax: number | null;
	flags: string[];
}

export enum ToursViatorQuerySortBy {
	PRICE = 'price',
	RATING = 'rating',
	TOP_SELLERS = 'top_sellers'
}

export enum ToursGetYourGuideQuerySortBy {
	PRICE = 'price',
	RATING = 'rating',
	DURATION = 'duration',
	POPULARITY = 'popularity'
}

export interface ToursViatorQuery {
	parentPlaceId: string;
	page: number | null;
	sortBy: ToursViatorQuerySortBy | null;
	sortDirection: ToursQueryDirection | null;
}

export interface ToursGetYourGuideQuery {
	query: string | null;
	bounds: Bounds | null;
	parentPlaceId: string | null;
	page: number | null;
	tags: number[];
	count: number | null;
	startDate: string | null;
	endDate: string | null;
	durationMin: number | null;
	durationMax: number | null;
	sortBy: ToursGetYourGuideQuerySortBy | null;
	sortDirection: ToursQueryDirection | null;
}

export enum ToursQueryDirection {
	ASC = 'asc',
	DESC = 'desc'
}
