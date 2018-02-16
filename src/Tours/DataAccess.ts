import { stringify } from 'query-string';

import { ApiResponse, StApi } from '../Api';
import { mapToursApiResponseToTours } from './Mapper';
import { Tour, ToursGetYourGuideQuery, ToursViatorQuery } from './Tour';

export async function getToursViator(toursQuery: ToursViatorQuery): Promise<Tour[]> {
	const query: any = {
		parent_place_id: toursQuery.parentPlaceId
	};

	if (toursQuery.page !== null) {
		query.page = toursQuery.page;
	}

	if (toursQuery.sortDirection !== null) {
		query.sort_direction = toursQuery.sortDirection;
	}

	if (toursQuery.sortBy !== null) {
		query.sort_by = toursQuery.sortBy;
	}

	const apiResponse: ApiResponse = await StApi.get('tours/viator?' + stringify(query));

	if (!apiResponse.data.hasOwnProperty('tours')) {
		throw new Error('Wrong API response');
	}

	return mapToursApiResponseToTours(apiResponse.data.tours);
}

export async function getToursGetYourGuide(toursQuery: ToursGetYourGuideQuery): Promise<Tour[]> {
	const query: any = {};

	if (toursQuery.query !== null) {
		query.query = toursQuery.query;
	}

	if (toursQuery.bounds !== null) {
		query.bounds = toursQuery.bounds.south + ','
			+ toursQuery.bounds.west + ','
			+ toursQuery.bounds.north + ','
			+ toursQuery.bounds.east;
	}

	if (toursQuery.parentPlaceId !== null) {
		query.parent_place_id = toursQuery.parentPlaceId;
	}

	if (toursQuery.page !== null) {
		query.page = toursQuery.page;
	}

	if (toursQuery.tags.length) {
		query.tags = toursQuery.tags.join(',');
	}

	if (toursQuery.count !== null) {
		query.count = toursQuery.count;
	}

	if (toursQuery.durationMin !== null) {
		query.duration_min = toursQuery.durationMin;
	}

	if (toursQuery.durationMax !== null) {
		query.duration_max = toursQuery.durationMax;
	}

	if (toursQuery.startDate !== null) {
		query.start_date = toursQuery.startDate;
	}

	if (toursQuery.endDate !== null) {
		query.end_date = toursQuery.endDate;
	}

	if (toursQuery.sortDirection !== null) {
		query.sort_direction = toursQuery.sortDirection;
	}

	if (toursQuery.sortBy !== null) {
		query.sort_by = toursQuery.sortBy;
	}

	const apiResponse: ApiResponse = await StApi.get('tours/get-your-guide?' + stringify(query));

	if (!apiResponse.data.hasOwnProperty('tours')) {
		throw new Error('Wrong API response');
	}

	return mapToursApiResponseToTours(apiResponse.data.tours);
}
