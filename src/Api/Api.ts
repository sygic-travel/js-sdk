import { boundsToMapTileKeys } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { PlacesListFilter } from '../Places/ListFilter';
import { ApiResponse, get as xhrGet} from '../Xhr';

export function getPlaces(filter: PlacesListFilter): Promise<ApiResponse> {
	if (filter.mapSpread) {
		return getPlacesWitMapSpread(filter);
	}
	return xhrGet('places/list?' + filter.toQueryString());
}

const getPlacesWitMapSpread = async (filter: PlacesListFilter): Promise<ApiResponse>  => {

	const mapTiles: string[] = boundsToMapTileKeys(filter.bounds as Bounds, filter.zoom as number);

	const apiResults: Promise<ApiResponse>[] = [];

	for (const mapTile of mapTiles) {
		let apiFilter = filter.cloneSetBounds(null);
		apiFilter = apiFilter.cloneSetLimit(32);
		apiFilter = apiFilter.cloneSetMapTiles([mapTile]);
		const promise = new Promise(async (success) => {
			try {
				success(await xhrGet('places/list?' + apiFilter.toQueryString()));
			} catch (error) {
				success(new ApiResponse( 200, {places: []}));
			}
		});
		apiResults.push(promise);
	}

	const responses = await Promise.all(apiResults);
	const finalResponse: ApiResponse = responses.reduce((result: ApiResponse, response: ApiResponse): ApiResponse => {
		result.statusCode = response.statusCode;
		result.data.places = result.data.places.concat(response.data.places);
		return result;
	}, new ApiResponse(200, {places: []}));

	finalResponse.data.places = finalResponse.data.places.sort((a, b) => {
		if (a.rating > b.rating) { return -1; }
		return 1;
	});
	return finalResponse;
};
