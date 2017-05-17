import { Medium } from '../Media/Media';
import * as Dao from './DataAccess';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import {
	mapPlaceApiResponseToPlaces, mapPlaceDetailedApiResponseToPlace,
	mapPlaceDetailedBatchApiResponseToPlaces
} from './Mapper';
import { Place, Price } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';

export {
	PlacesFilter,
	Place,
	PlacesFilterJSON,
	Price,
	PlaceDetail,
	Reference,
	Tag,
	Description,
}

export async function getPlaces(filter: PlacesFilter): Promise<Place[]> {
	const places: any[] = await Dao.getPlaces(filter);
	return mapPlaceApiResponseToPlaces(places);
}

export async function getPlaceDetailed(id: string, photoSize: string): Promise<Place> {
	const place: any = await Dao.getPlaceDetailed(id);
	return mapPlaceDetailedApiResponseToPlace(place, photoSize);
}

export async function getPlaceDetailedBatch(ids: string[], photoSize: string): Promise<Place[]> {
	const placeDetailedBatch: any[] = await Dao.getPlaceDetailedBatch(ids);
	return mapPlaceDetailedBatchApiResponseToPlaces(placeDetailedBatch, photoSize);
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	const media: any[] = await Dao.getPlaceMedia(id);
	return media.map((mediaItem: any) => mediaItem as Medium);
}
