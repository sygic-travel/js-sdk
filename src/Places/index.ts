import { Bounds, Location } from '../Geo';
import { Medium } from '../Media/Media';
import { Day, Trip } from '../Trip/';
import * as Dao from './DataAccess';
import { PlacesListFilter, PlacesListFilterJSON } from './ListFilter';
import { CustomPlaceFormData, hasTag, isStickyByDefault, Place } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';
import { PlacesStats } from './Stats';
import { PlacesStatsFilter, PlacesStatsFilterJSON } from './StatsFilter';

export {
	CustomPlaceFormData,
	hasTag,
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

export const DESTINATION_BREAK_LEVELS = ['city', 'town', 'village', 'island'];

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

export async function getPlacesMapFromTrip(trip: Trip): Promise<Map<string, Place>> {
	const placesMapFromTrip: Map<string, Place> = new Map<string, Place>();

	if (!trip.days) {
		throw new Error('Can\'t generate PDF data for trip without days');
	}

	const placesForDays: Place[][] = await Promise.all(
		trip.days.map((day: Day) => Dao.getPlacesFromTripDay(day))
	);
	const placesFromTrips: Place[] = ([] as Place[]).concat(...placesForDays);

	placesFromTrips.forEach((place: Place) => {
		placesMapFromTrip.set(place.id, place);
	});

	return placesMapFromTrip;
}

export async function getPlacesDestinationMap(placesIds: string[]): Promise<Map<string, Place>> {
	const places: Place[] = await Dao.getPlacesDetailed(placesIds, '100x100');

	const placesParentIds: Set<string> = new Set<string>();
	places.forEach((place: Place) => {
		place.parents.forEach((parentId: string) => placesParentIds.add(parentId));
	});

	const parentPlaces: Place[] = await Dao.getPlacesDetailed(Array.from(placesParentIds), '100x100');
	const parentPlacesMap: Map<string, Place> = new Map<string, Place>();
	parentPlaces.forEach((parentPlace: Place) => {
		parentPlacesMap.set(parentPlace.id, parentPlace);
	});

	const destinationsMap: Map<string, Place> = new Map<string, Place>();
	places.forEach((place: Place) => {
		const placeDestination: Place = getPlaceDestination(place, parentPlacesMap);
		destinationsMap.set(place.id, placeDestination);
	});

	return destinationsMap;
}

export function getPlaceDestination(place: Place, parentPlacesMap: Map<string, Place>): Place {
	if (isPlaceDestination(place)) {
		return place;
	}

	const reversedPlaceParentIds = place.parents.slice().reverse();

	for (const parentId of reversedPlaceParentIds) {
		const parentPlace: Place|undefined = parentPlacesMap.get(parentId);
		if (parentPlace && isPlaceDestination(parentPlace)) {
			return parentPlace;
		}
	}

	return parentPlacesMap.get(reversedPlaceParentIds[0])!;
}

export function isPlaceDestination(place: Place): boolean {
	return DESTINATION_BREAK_LEVELS.includes(place.level);
}

export function mergePlacesArrays(places1: Place[], places2: Place[]): Place[] {
	return places2.reduce(
		(acc: Place[], placeFromPlaces1: Place) => {
			const placeFromPlaces2: Place | undefined = acc.find((p: Place) => p.id === placeFromPlaces1.id);
			if (placeFromPlaces2 === undefined) {
				acc.push(placeFromPlaces1);
			}
			return acc;
		},
		places1
	);
}
