import { stringify } from 'query-string';

import { Location } from '../Geo';
import { get } from '../Xhr';
import { mapSearchAddressesApiRepsponseToAddresses } from './Mapper';
import { SearchAddressResult } from './SearchAddressResult';

export async function searchAddress(query: string, location?: Location): Promise<SearchAddressResult[]> {
	const queryString: string = location ? stringify({
		query,
		location: [location.lat, location.lng].join(',')
	}) : stringify({ query });
	const apiResponse = await get('search?' +  queryString);

	if (!apiResponse.data.hasOwnProperty('locations')) {
		throw new Error('Wrong API response');
	}

	return mapSearchAddressesApiRepsponseToAddresses(apiResponse.data.locations);
}
