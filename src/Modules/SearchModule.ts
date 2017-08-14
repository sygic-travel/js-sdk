import { Location } from '../Geo';
import { search, SearchResult, searchReverse } from '../Search';

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
}
