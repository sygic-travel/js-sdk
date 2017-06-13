import { Medium } from '../Media/Media';
import * as Dao from './DataAccess';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import { isStickyByDefault, Place, Price } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';

export {
	isStickyByDefault,
	PlacesFilter,
	Place,
	PlacesFilterJSON,
	Price,
	PlaceDetail,
	Reference,
	Tag,
	Description,
	Dao,
}

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	return await Dao.getPlaces(filter);
}

export async function getPlaceDetailed(id: string, photoSize: string): Promise<Place> {
	return await Dao.getPlaceDetailed(id, photoSize);
}

export async function getPlaceDetailedBatch(ids: string[], photoSize: string): Promise<Place[]> {
	return await Dao.getPlaceDetailedBatch(ids, photoSize);
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	return await Dao.getPlaceMedia(id);
}
