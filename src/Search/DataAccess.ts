import { stringify } from 'query-string';

import { Location } from '../Geo';
import { get } from '../Xhr';
import {mapSearchApiResponseToSearchResults } from './Mapper';
import { SearchResult } from './SearchResult';

export async function search(query: string, location?: Location): Promise<SearchResult[]> {
	const queryString: string = location ? stringify({
		query,
		location: [location.lat, location.lng].join(',')
	}) : stringify({ query });
	const apiResponse = await get('search?' +  queryString);

	if (!apiResponse.data.hasOwnProperty('locations')) {
		throw new Error('Wrong API response');
	}

	return mapSearchApiResponseToSearchResults(apiResponse.data.locations);
}

export async function searchReverse(location: Location): Promise<SearchResult[]> {
	const queryString: string = stringify({
		location: [location.lat, location.lng].join(',')
	});
	const apiResponse = await get('search/reverse?' +  queryString);

	if (!apiResponse.data.hasOwnProperty('locations')) {
		throw new Error('Wrong API response');
	}

	return mapSearchApiResponseToSearchResults(apiResponse.data.locations);
}
