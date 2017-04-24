import { BaseSDK } from './BaseSDK';
import { Bounds } from './Geo';
import { Medium } from './Media/Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces } from './Places';
import { PlacesFilter, PlacesFilterJSON } from './Places/Filter';
import { Place } from './Places/Place';
import { CanvasSize, spread, SpreadSizeConfig } from './Spread';
import { SpreadResult } from './Spread/Spreader';

export default class StSDK extends BaseSDK {
	public getPlaces(filter: PlacesFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesFilter(filter));
	}

	public getPlaceDetailed(guid: string, photoSize: string): Promise<Place> {
		return getPlaceDetailed(guid, photoSize);
	}

	public getPlaceMedia(guid: string): Promise<Medium[]> {
		return getPlaceMedia(guid);
	}

	public spreadPlacesOnMap(
		places: Place[],
		markerSizes: SpreadSizeConfig[],
		bounds: Bounds,
		canvas: CanvasSize
	): SpreadResult {
		return spread(places, markerSizes, bounds, canvas);
	}
}
