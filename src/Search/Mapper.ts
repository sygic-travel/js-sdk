import { camelizeKeys } from 'humps';

import { SearchLocation } from './SearchLocation';

export function mapSearchLocationsApiRepsponseToLocations(searchLocations: any): SearchLocation[] {
	return searchLocations.map((searchLocation) => {
		return camelizeKeys(searchLocation) as SearchLocation;
	});
}
