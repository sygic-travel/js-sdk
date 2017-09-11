import { camelizeKeys } from 'humps';

import { mapPlaceDetailedApiResponseToPlace } from '../Places/Mapper';
import { SearchResult, SearchTagsResult } from './SearchResult';

export function mapSearchApiResponseToSearchResults(searchLocations: any): SearchResult[] {
	return searchLocations.map((searchLocation) => ({
			location: camelizeKeys(searchLocation.location),
			type: searchLocation.type,
			distance: searchLocation.distance,
			address: camelizeKeys(searchLocation.address),
			place: searchLocation.place ? mapPlaceDetailedApiResponseToPlace(searchLocation.place, '150x150') : null
		} as SearchResult
	));
}

export function mapSearchTagsApiResponseToTags(tags: any): SearchTagsResult[] {
	return tags.map((tag: any) => camelizeKeys(tag) as SearchTagsResult);
}
