import {Media} from './Media/Media';
import {Place} from './Places/Place';
import {PlaceDetailed} from './Places/PlaceDetailed';
import { getPlaceDetailed, getPlaceMedia, getPlaces } from './Places/PlacesController';
import PlacesFilter from './Places/PlacesFilter';
import {SdkBase} from './SdkBase';

export default class SdkBrowser extends SdkBase {
	public getPlaces(filter: PlacesFilter): Promise<Place[]> {
		return getPlaces(filter);
	}

	public getPlaceDetailed(guid: string, photoSize: string): Promise<PlaceDetailed> {
		return getPlaceDetailed(guid, photoSize);
	}

	public getPlaceMedia(guid: string): Promise<Media[]> {
		return getPlaceMedia(guid);
	}
}
