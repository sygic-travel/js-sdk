import { Bounds } from './Geo';
import { Media } from './Media/Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces } from './Places';
import { PlacesFilter, PlacesFilterJSON } from './Places/Filter';
import { Place } from './Places/Place';
import { PlaceDetailed  } from './Places/PlaceDetailed';
import { SdkBase } from './SdkBase';
import { CanvasSize, spread, SpreadConfigSize } from './Spread';

export default class SdkBrowser extends SdkBase {
	public getPlaces(filter: PlacesFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesFilter(filter));
	}

	public getPlaceDetailed(guid: string, photoSize: string): Promise<PlaceDetailed> {
		return getPlaceDetailed(guid, photoSize);
	}

	public getPlaceMedia(guid: string): Promise<Media[]> {
		return getPlaceMedia(guid);
	}

	public spreadPlacesOnMap(places: Place[], markerSizes: SpreadConfigSize[], bounds: Bounds, canvas: CanvasSize) {
		return spread(places, markerSizes, bounds, canvas);
	}
}
