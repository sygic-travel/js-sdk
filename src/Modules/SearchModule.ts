import { Location } from '../Geo';
import { searchAddress, SearchAddressResult, searchAddressReverse } from '../Search';

/**
 * @experimental
 */
export default class SearchModule {
	public searchAddress(query: string, location?: Location): Promise<SearchAddressResult[]> {
		return searchAddress(query, location);
	}

	public searchAddressReverse(location: Location): Promise<SearchAddressResult[]> {
		return searchAddressReverse(location);
	}
}
