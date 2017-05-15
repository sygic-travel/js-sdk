import * as api from '../Api';
import { Medium } from '../Media/Media';
import * as Dao from './DataAccess';
import { get } from '../Xhr';
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
	const apiResponse = await api.getPlaces(filter);
	if (!apiResponse.data.hasOwnProperty('places')) {
		throw new Error('Wrong API response');
	}
	return mapPlaceApiResponseToPlaces(apiResponse.data.places);
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
	const apiResponse = await get('places/' + id + '/media');
	if (!apiResponse.data.hasOwnProperty('media')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.media.map((media: any) => media as Medium);
}
