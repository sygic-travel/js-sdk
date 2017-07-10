import { listToEnum } from '../Util';

const toursQuerySortByValues = listToEnum([
	'price',
	'rating',
	'top_sellers'
]);

export type ToursQuerySortBy = keyof typeof toursQuerySortByValues;

const toursSortDirectionValues = listToEnum([
	'asc',
	'desc'
]);

export type ToursQueryDirection = keyof typeof toursSortDirectionValues;

export interface ToursQuery {
	destinationId: string;
	page?: number;
	sortBy?: ToursQuerySortBy;
	sortDirection?: ToursQueryDirection;
}
