import { camelizeKeys } from 'humps';

import { SearchAddressResult } from './SearchAddressResult';

export function mapSearchAddressesApiRepsponseToAddresses(searchLocations: any): SearchAddressResult[] {
	return searchLocations.map((searchLocation) => {
		const result: SearchAddressResult = camelizeKeys(searchLocation) as SearchAddressResult;
		if (!result.hasOwnProperty('type')) {
			result.type = 'address';
		}
		if (!result.hasOwnProperty('distance')) {
			result.distance = null;
		}
		return result;
	});
}
