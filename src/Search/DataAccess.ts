import { stringify } from 'query-string';

import { Location } from '../Geo';
import { get } from '../Xhr';
import { mapSearchLocationsApiRepsponseToLocations } from './Mapper';
import { SearchLocation } from './SearchLocation';

export async function searchLocations(query: string, location: Location): Promise<SearchLocation[]> {
	const apiResponse = await get('search?' + stringify({
		query,
		location: [location.lat, location.lng].join(',')
	}));

	if (!apiResponse.data.hasOwnProperty('locations')) {
		throw new Error('Wrong API response');
	}

	return mapSearchLocationsApiRepsponseToLocations(apiResponse.data.locations);
}
