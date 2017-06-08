import { Location } from '../Geo';
import * as Dao from './DataAccess';
import { Address, AddressFields, SearchAddressResult } from './SearchAddressResult';

export { Address, AddressFields, SearchAddressResult }

export async function searchAddress(query: string, location?: Location): Promise<SearchAddressResult[]> {
	return Dao.searchAddress(query, location);
}
