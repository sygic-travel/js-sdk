export enum ToursQuerySortBy {
	price = 'price',
	rating = 'rating',
	top_sellers = 'top_sellers'
}

export enum ToursQueryDirection {
	asc = 'asc',
	desc = 'desc'
}

export interface ToursQuery {
	parentPlaceId: string;
	page?: number;
	sortBy?: ToursQuerySortBy;
	sortDirection?: ToursQueryDirection;
}
