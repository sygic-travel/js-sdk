import { Bounds, Location } from '../Geo';
import { Medium } from '../Media/Media';
import * as Dao from './DataAccess';
import { PlacesListFilter, PlacesListFilterJSON } from './ListFilter';
import { CustomPlaceFormData, isStickyByDefault, Place } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';
import { PlacesStats } from './Stats';
import { PlacesStatsFilter, PlacesStatsFilterJSON } from './StatsFilter';

export {
	CustomPlaceFormData,
	isStickyByDefault,
	DayOpeningHours,
	PlacesListFilter,
	PlacesStatsFilter,
	Place,
	PlacesListFilterJSON,
	PlacesStatsFilterJSON,
	PlaceGeometry,
	PlaceDetail,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewsData,
	PlacesStats,
	Reference,
	Tag,
	Description,
	Dao,
}

export async function getPlaces(filter: PlacesListFilter): Promise<Place[]> {
	return await Dao.getPlaces(filter);
}

export async function getPlacesStats(filter: PlacesStatsFilter): Promise<PlacesStats> {
	return await Dao.getPlacesStats(filter);
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

export async function createCustomPlace(data: CustomPlaceFormData): Promise<Place> {
	return await Dao.createCustomPlace(data);
}

export async function updateCustomPlace(id: string, data: CustomPlaceFormData): Promise<Place> {
	return await Dao.updateCustomPlace(id, data);
}

export async function deleteCustomPlace(id: string): Promise<void> {
	return await Dao.deleteCustomPlace(id);
}

export async function getPlaceGeometry(id: string): Promise<PlaceGeometry> {
	return await Dao.getPlaceGeometry(id);
}

export async function getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
	return await Dao.getPlaceOpeningHours(id, from, to);
}

export async function addPlaceReview(placeId: string, rating: number, message: string): Promise<PlaceReview> {
	return Dao.addPlaceReview(placeId, rating, message);
}

export async function deletePlaceReview(reviewId: number): Promise<void> {
	return Dao.deletePlaceReview(reviewId);
}

export async function getPlaceReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
	return Dao.getPlaceReviews(placeId, limit, page);
}

export async function voteOnReview(reviewId: number, voteValue: number): Promise<void> {
	return Dao.voteOnReview(reviewId, voteValue);
}

export async function detectParentsByBounds(bounds: Bounds, zoom: number): Promise<Place[]> {
	return Dao.detectParentsByBounds(bounds, zoom);
}

export async function detectParentsByLocation(location: Location): Promise<Place[]> {
	return Dao.detectParentsByLocation(location);
}
