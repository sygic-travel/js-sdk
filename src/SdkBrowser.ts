import {Media} from './Media/Media';
import {PlacesFilter, PlacesFilterJSON} from './Places/Filter';
import {Place} from './Places/Place';
import {PlaceDetailed} from './Places/PlaceDetailed';
import { getPlaceDetailed, getPlaceMedia, getPlaces } from './Places/Controller';
import {SdkBase} from './SdkBase';

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
}
