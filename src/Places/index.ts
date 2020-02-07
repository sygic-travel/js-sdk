import { Bounds, Location } from '../Geo';
import { Medium } from '../Media/Media';
import { Day, Trip } from '../Trip/';
import * as Dao from './DataAccess';
import { PlacesListFilterJSON, PlacesQuery } from './ListFilter';
import { Category, CustomPlaceFormData, DetailedPlace, hasTag, isStickyByDefault, Level, Place, Parent } from './Place';
import { PlaceAutoTranslation } from './PlaceAutoTranslation';
import { Description, Detail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';
import {
	PlaceReview,
	PlaceReviewFromYelp,
	PlaceReviewFromYelpUser,
	PlaceReviewsData,
	PlaceReviewsFromYelpData
} from './PlaceReview';
import { PlacesStats } from './Stats';
import { PlacesStatsFilter, PlacesStatsFilterJSON } from './StatsFilter';

export {
	Category,
	CustomPlaceFormData,
	Dao,
	DayOpeningHours,
	Description,
	Detail,
	hasTag,
	isStickyByDefault,
	Level,
	Parent,
	Place,
	PlaceAutoTranslation,
	PlaceGeometry,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewFromYelp,
	PlaceReviewFromYelpUser,
	PlaceReviewsData,
	PlaceReviewsFromYelpData,
	PlacesListFilterJSON,
	PlacesQuery,
	PlacesStats,
	PlacesStatsFilter,
	PlacesStatsFilterJSON,
	Reference,
	Tag,
};

export const DESTINATION_BREAK_LEVELS = [Level.CITY, Level.TOWN, Level.VILLAGE, Level.ISLAND];

export async function getPlaces(filter: PlacesQuery): Promise<Place[]> {
	return Dao.getPlaces(filter);
}

export async function getPlacesStats(filter: PlacesStatsFilter): Promise<PlacesStats> {
	return Dao.getPlacesStats(filter);
}

export async function getDetailedPlace(id: string, photoSize: string): Promise<DetailedPlace> {
	return Dao.getDetailedPlace(id, photoSize);
}

export async function getDetailedPlaces(ids: string[], photoSize: string): Promise<DetailedPlace[]> {
	return Dao.getDetailedPlaces(ids, photoSize);
}

export async function getDetailedPlacesMap(ids: string[], photoSize: string): Promise<Map<string, Place>> {
	const detailedPlaces: Place[] = await getDetailedPlaces(ids, photoSize);
	const detailedPlacesMap: Map<string, Place> = new Map<string, Place>();
	detailedPlaces.forEach((placeDetailed: Place) => {
		detailedPlacesMap.set(placeDetailed.id, placeDetailed);
	});
	return detailedPlacesMap;
}

export async function getPlaceMedia(id: string): Promise<Medium[]> {
	return Dao.getPlaceMedia(id);
}

export async function createCustomPlace(data: CustomPlaceFormData): Promise<Place> {
	return Dao.createCustomPlace(data);
}

export async function updateCustomPlace(id: string, data: CustomPlaceFormData): Promise<Place> {
	return Dao.updateCustomPlace(id, data);
}

export async function deleteCustomPlace(id: string): Promise<void> {
	return Dao.deleteCustomPlace(id);
}

export async function getPlaceGeometry(id: string): Promise<PlaceGeometry> {
	return Dao.getPlaceGeometry(id);
}

export async function getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
	return Dao.getPlaceOpeningHours(id, from, to);
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

export async function getPlaceReviewsFromYelp(placeId: string): Promise<PlaceReviewsFromYelpData> {
	return Dao.getPlaceReviewsFromYelp(placeId);
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

export async function getPlacesMapFromTrip(trip: Trip, imageSize: string): Promise<Map<string, Place>> {
	const placesMapFromTrip: Map<string, Place> = new Map<string, Place>();

	if (!trip.days) {
		throw new Error('Can\'t generate PDF data for trip without days');
	}

	const placesForDays: Place[][] = await Promise.all(
		trip.days.map((day: Day) => Dao.getPlacesFromTripDay(day, imageSize))
	);
	const placesFromTrips: Place[] = ([] as Place[]).concat(...placesForDays);

	placesFromTrips.forEach((place: Place) => {
		placesMapFromTrip.set(place.id, place);
	});

	return placesMapFromTrip;
}

export async function getPlacesDestinationMap(placesIds: string[], imageSize: string): Promise<Map<string, Place>> {
	const places: Place[] = await Dao.getDetailedPlaces(placesIds, imageSize);

	const placesParentIds: Set<string> = new Set<string>();
	places.forEach((place: Place) => {
		place.parents.forEach((parent: Parent) => placesParentIds.add(parent.id));
	});

	const parentPlaces: Place[] = await Dao.getDetailedPlaces(Array.from(placesParentIds), imageSize);
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

	const reversedPlaceParents = place.parents.slice().reverse();

	for (const parent of reversedPlaceParents) {
		const parentPlace: Place | undefined = parentPlacesMap.get(parent.id);
		if (parentPlace && isPlaceDestination(parentPlace)) {
			return parentPlace;
		}
	}

	const countryParent: Place | undefined = reversedPlaceParents.map((parentPlace: Parent): Place =>
		parentPlacesMap.get(parentPlace.id)!
	).find((parentPlace: Place) => parentPlace.level === 'country');

	return countryParent ? countryParent : parentPlacesMap.get(reversedPlaceParents[0].id)!;
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

export function getPlaceAutoTranslation(placeId: string): Promise<PlaceAutoTranslation> {
	return Dao.getPlaceAutoTranslation(placeId);
}
