import { BaseSDK } from './BaseSDK';
import { Bounds } from './Geo';
import { Medium } from './Media';
import { getPlaceDetailed, getPlaceMedia, getPlaces, Place, PlacesFilter, PlacesFilterJSON } from './Places';
import { setUserSession } from './Settings/index';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from './Spread';
import { getTripDetailed, getTrips, Trip } from './Trip';

export default class StSDK extends BaseSDK {
	public setUserSession(key: string | null, token: string | null): void {
		return setUserSession(key, token);
	}

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

	public getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
		return getTrips(dateFrom, dateTo);
	}

	public getTripDetailed(id: string): Promise<Trip> {
		return getTripDetailed(id);
	}
}
