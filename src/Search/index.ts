import { Location } from '../Geo';
import * as Dao from './DataAccess';
import { Address, AddressFields, SearchResult } from './SearchResult';

export { Address, AddressFields, SearchResult }

export async function search(query: string, location?: Location): Promise<SearchResult[]> {
	return Dao.search(query, location);
}

export async function searchReverse(location: Location): Promise<SearchResult[]> {
	return Dao.searchReverse(location);
}
