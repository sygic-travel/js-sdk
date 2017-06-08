import { stringify } from 'query-string';

import { Location } from '../Geo';
import { get } from '../Xhr';
import { mapSearchLocationsApiRepsponseToLocations } from './Mapper';
import { SearchLocation } from './SearchLocation';

export async function searchLocations(query: string, location?: Location): Promise<SearchLocation[]> {
	const queryString: string = location ? stringify({
		query,
		location: [location.lat, location.lng].join(',')
	}) : stringify({ query });
	const apiResponse = await get('search?' +  queryString);

	if (!apiResponse.data.hasOwnProperty('locations')) {
		throw new Error('Wrong API response');
	}

	return mapSearchLocationsApiRepsponseToLocations(apiResponse.data.locations);
}
