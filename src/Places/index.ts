import { Medium } from '../Media/Media';
import * as Dao from './DataAccess';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import { isStickyByDefault, Place } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';

export {
	isStickyByDefault,
	DayOpeningHours,
	PlacesFilter,
	Place,
	PlacesFilterJSON,
	PlaceGeometry,
	PlaceDetail,
	PlaceOpeningHours,
	PlaceReview,
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

export async function getPlacesDetailed(ids: string[], photoSize: string): Promise<Place[]> {
	return await Dao.getPlacesDetailed(ids, photoSize);
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	return await Dao.getPlaceMedia(id);
}

export async function getPlaceGeometry(id: string): Promise<PlaceGeometry> {
	return await Dao.getPlaceGeometry(id);
}

export async function getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
	return await Dao.getPlaceOpeningHours(id, from, to);
}

export async function addItemReview(placeId: number, raring: number, message: string): Promise<PlaceReview> {
	return Dao.addItemReview(placeId, raring, message);
}

export async function deleteItemReview(reviewId: number): Promise<void> {
	return Dao.deleteItemReview(reviewId);
}

export async function getItemReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
	return Dao.getItemReviews(placeId, limit, page);
}

export async function voteOnReview(reviewId: number, voteValue: number): Promise<void> {
	return Dao.voteOnReview(reviewId, voteValue);
}
