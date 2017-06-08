import { Location } from '../Geo';
import * as Dao from './DataAccess';
import { Address, AddressFields, SearchLocation } from './SearchLocation';

export { Address, AddressFields, SearchLocation }

export async function searchLocations(query: string, location?: Location): Promise<SearchLocation[]> {
	return Dao.searchLocations(query, location);
}
