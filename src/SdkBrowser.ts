import { Bounds } from './Geo';
import { Medium } from './Media/Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces } from './Places';
import { PlacesFilter, PlacesFilterJSON } from './Places/Filter';
import { Place } from './Places/Place';
import { SdkBase } from './SdkBase';
import { CanvasSize, spread, SpreadSizeConfig } from './Spread';

export default class SdkBrowser extends SdkBase {
	public getPlaces(filter: PlacesFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesFilter(filter));
	}

	public getPlaceDetailed(guid: string, photoSize: string): Promise<Place> {
		return getPlaceDetailed(guid, photoSize);
	}

	public getPlaceMedia(guid: string): Promise<Medium[]> {
		return getPlaceMedia(guid);
	}

	public spreadPlacesOnMap(places: Place[], markerSizes: SpreadSizeConfig[], bounds: Bounds, canvas: CanvasSize) {
		return spread(places, markerSizes, bounds, canvas);
	}
}
