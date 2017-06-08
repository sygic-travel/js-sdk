import { camelizeKeys } from 'humps';

import { SearchAddressResult } from './SearchAddressResult';

export function mapSearchAddressesApiRepsponseToAddresses(searchLocations: any): SearchAddressResult[] {
	return searchLocations.map((searchLocation) => {
		return camelizeKeys(searchLocation) as SearchAddressResult;
	});
}
