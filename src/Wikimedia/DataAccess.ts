import { camelizeKeys } from 'humps';
import { stringify } from 'query-string';

import { ApiResponse, StApi } from '../Api';
import { Location } from '../Geo';
import { WikimediaResult } from './Wikimedia';

const WIKIMEDIA_COMMON_DOMAIN = 'commons.wikimedia.org';
const WIKIMEDIA_WIKPEDIA_DOMAIN = 'en.wikipedia.org';

export async function getByQuery(query: string): Promise<WikimediaResult[]> {
	const apiQuery: any = {
		domain: WIKIMEDIA_COMMON_DOMAIN,
		query
	};
	const wikiCommonResponse: Promise<ApiResponse> = StApi.get('wikimedia/search-by-query/?' + stringify(apiQuery));
	apiQuery.domain = WIKIMEDIA_WIKPEDIA_DOMAIN;
	const wikiResponse: Promise<ApiResponse> = StApi.get('wikimedia/search-by-query/?' + stringify(apiQuery));

	return processApiResponses(await Promise.all([wikiCommonResponse, wikiResponse]));
}

export async function getByLocation(location: Location): Promise<WikimediaResult[]> {
	const apiQuery: any = {
		domain: WIKIMEDIA_COMMON_DOMAIN,
		location: location.lat + ',' + location.lng
	};
	const wikiCommonResponse: Promise<ApiResponse> = StApi.get('wikimedia/search-by-location/?' + stringify(apiQuery));
	apiQuery.domain = WIKIMEDIA_WIKPEDIA_DOMAIN;
	const wikiResponse: Promise<ApiResponse> = StApi.get('wikimedia/search-by-location/?' + stringify(apiQuery));
	return processApiResponses(await Promise.all([wikiCommonResponse, wikiResponse]));
}

function processApiResponses(responses: ApiResponse[]): WikimediaResult[] {
	const results: WikimediaResult[] = [];
	return results.concat(...responses.map((response: ApiResponse): WikimediaResult[] => {
		if (!response.data.hasOwnProperty('wikimedia')) {
			throw new Error('Wrong API response');
		}
		return response.data.wikimedia.map((item: any) => camelizeKeys(item));
	})).filter((wikimedia: WikimediaResult, index: number, self: WikimediaResult[]) => {
		return index === self.findIndex((media: WikimediaResult) => wikimedia.id === media.id);
	}) as WikimediaResult[];
}
