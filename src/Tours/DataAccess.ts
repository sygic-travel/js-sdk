import { stringify } from 'query-string';

import { ApiResponse, get } from '../Xhr';
import { mapToursApiResponseToTours } from './Mapper';
import { Tour } from './Tour';
import { ToursQuery } from './ToursQuery';

export async function getTours(toursQuery: ToursQuery): Promise<Tour[]> {
	const apiResponse: ApiResponse = await get('tours?' + stringify({
			destination_id: toursQuery.destinationId,
			page: toursQuery.page,
			sort_by: toursQuery.sortBy,
			sort_direction: toursQuery.sortDirection
		}));

	if (!apiResponse.data.hasOwnProperty('tours')) {
		throw new Error('Wrong API response');
	}

	return mapToursApiResponseToTours(apiResponse.data.tours);
}
