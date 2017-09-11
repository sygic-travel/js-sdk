import { Location } from '../Geo';
import { search, SearchResult, searchReverse, searchTags, SearchTagsResult } from '../Search';

/**
 * @experimental
 */
export default class SearchModule {
	public search(query: string, location?: Location): Promise<SearchResult[]> {
		return search(query, location);
	}

	public searchReverse(location: Location): Promise<SearchResult[]> {
		return searchReverse(location);
	}

	public searchTags(query: string): Promise<SearchTagsResult[]> {
		return searchTags(query);
	}
}
