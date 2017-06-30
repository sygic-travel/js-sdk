import { boundsToMapTileKeys } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { PlacesFilter } from '../Places/Filter';
import { ApiResponse, get as xhrGet} from '../Xhr';

export function getPlaces(filter: PlacesFilter): Promise<ApiResponse> {
	if (filter.mapSpread) {
		return getPlacesWitMapSpread(filter);
	}
	return xhrGet('places/list?' + filter.toQueryString());
}

const getPlacesWitMapSpread = async (filter: PlacesFilter): Promise<ApiResponse>  => {

	let zoom: number = filter.zoom ? filter.zoom : 1;
	// The highest zoom api can handle
	if (zoom > 18) {
		zoom = 18;
	}
	const mapTiles: string[] = boundsToMapTileKeys(filter.bounds as Bounds, zoom);

	let apiFilter = filter.cloneSetBounds(null);
	apiFilter = apiFilter.cloneSetLimit(32);
	apiFilter = apiFilter.cloneSetMapTiles(mapTiles);
	return await xhrGet('places/list?' + apiFilter.toQueryString());
};
