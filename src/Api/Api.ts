import { boundsToMapTileKeys } from '../Geo';
import { PlacesFilter } from '../Places/Filter';
import { ApiResponse, get as xhrGet} from '../Xhr';

export function getPlaces(filter: PlacesFilter): Promise<ApiResponse> {
	if (filter.mapSpread) {
		return getPlacesWitMapSpread(filter);
	}
	return xhrGet('places?' + filter.toQueryString());
}

const getPlacesWitMapSpread = async (filter: PlacesFilter): Promise<ApiResponse>  => {

	const mapTiles: string[] = boundsToMapTileKeys(filter.bounds, filter.zoom);

	const apiResults = [];

	for (const mapTile of mapTiles) {
		let apiFilter = filter.cloneSetBounds(null);
		apiFilter = apiFilter.cloneSetLimit(32);
		apiFilter = apiFilter.cloneSetMapTile(mapTile);
		const promise = new Promise(async (success) => {
			try {
				success(await xhrGet('places?' + apiFilter.toQueryString()));
			} catch (error) {
				success(new ApiResponse('', 200, '', {places: []}));
			}
		});
		apiResults.push(promise);
	}

	const responses = await Promise.all(apiResults);
	const finalResponse: ApiResponse = responses.reduce((result: ApiResponse, response: ApiResponse): ApiResponse => {
		result.statusMessage = response.statusMessage;
		result.statusCode = response.statusCode;
		result.data.places = result.data.places.concat(response.data.places);
		return result;
	}, new ApiResponse('', 200, '', {places: []}));

	finalResponse.data.places = finalResponse.data.places.sort((a, b) => {
		if (a.rating > b.rating) { return -1; }
		return 1;
	});
	return finalResponse;
};
