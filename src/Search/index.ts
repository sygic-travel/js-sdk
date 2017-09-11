import { Location } from '../Geo';
import * as Dao from './DataAccess';
import { Address, AddressFields, SearchResult, SearchTagsResult } from './SearchResult';

export { Address, AddressFields, SearchResult, SearchTagsResult }

export async function search(query: string, location?: Location): Promise<SearchResult[]> {
	return Dao.search(query, location);
}

export async function searchReverse(location: Location): Promise<SearchResult[]> {
	return Dao.searchReverse(location);
}

export async function searchTags(query: string): Promise<SearchTagsResult[]> {
	return Dao.searchTags(query);
}
