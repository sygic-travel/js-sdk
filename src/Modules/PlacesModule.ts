import { Bounds, Location } from '../Geo';
import { Medium } from '../Media';
import {
	addPlaceReview,
	deletePlaceReview,
	detectParentsByBounds,
	detectParentsByLocation,
	getDetailedPlace,
	getDetailedPlaces,
	getPlaceAutoTranslation,
	getPlaceGeometry,
	getPlaceMedia,
	getPlaceOpeningHours,
	getPlaceReviews,
	getPlaces,
	getPlacesDestinationMap,
	getPlacesStats,
	Place,
	PlaceGeometry,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewsData,
	PlacesListFilterJSON,
	PlacesQuery,
	PlacesStats,
	PlacesStatsFilter,
	PlacesStatsFilterJSON,
	voteOnReview
} from '../Places';
import { PlaceAutoTranslation } from '../Places/PlaceAutoTranslation';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from '../Spread';
import {
	CategoriesCoefficients,
	spread as spreadV2,
	SpreadResult as SpreadResultV2,
	SpreadSizeConfig as SpreadSizeConfigV2
} from '../SpreadV2';

export default class PlacesModule {
	public getPlaces(filter: PlacesListFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesQuery(filter));
	}

	public getDetailedPlace(id: string, photoSize: string): Promise<Place> {
		return getDetailedPlace(id, photoSize);
	}

	public getDetailedPlaces(ids: string[], photoSize: string): Promise<Place[]> {
		return getDetailedPlaces(ids, photoSize);
	}

	public getPlaceMedia(id: string): Promise<Medium[]> {
		return getPlaceMedia(id);
	}

	public getPlacesStats(filter: PlacesStatsFilterJSON): Promise<PlacesStats> {
		return getPlacesStats(new PlacesStatsFilter(filter));
	}

	public getPlaceGeometry(id: string): Promise<PlaceGeometry> {
		return getPlaceGeometry(id);
	}

	public getPlaceOpeningHours(id: string, from: string, to: string): Promise<PlaceOpeningHours> {
		return getPlaceOpeningHours(id, from, to);
	}

	public detectParentsByBounds(bounds: Bounds, zoom: number): Promise<Place[]>  {
		return detectParentsByBounds(bounds, zoom);
	}

	public detectParentsByLocation(location: Location): Promise<Place[]>  {
		return detectParentsByLocation(location);
	}

	public addPlaceReview(placeId: string, rating: number, message: string): Promise<PlaceReview> {
		return addPlaceReview(placeId, rating, message);
	}

	public deletePlaceReview(reviewId: number): Promise<void> {
		return deletePlaceReview(reviewId);
	}

	public getPlaceReviews(placeId: string, limit: number, page: number): Promise<PlaceReviewsData> {
		return getPlaceReviews(placeId, limit, page);
	}

	public voteOnReview(reviewId: number, voteValue: number): Promise<void> {
		return voteOnReview(reviewId, voteValue);
	}

	public spreadPlacesOnMap(
		places: Place[],
		bounds: Bounds,
		canvas: CanvasSize,
		sizesConfig?: SpreadSizeConfig[]
	): SpreadResult {
		return spread(places, bounds, canvas, sizesConfig);
	}

	/**
	 * @experimental
	 */
	public spreadPlacesOnMapV2(
		places: Place[],
		vipPlaces: Place[],
		bounds: Bounds,
		canvas: CanvasSize,
		sizesConfig?: SpreadSizeConfigV2[],
		categoriesCoefficients?: CategoriesCoefficients | null,
		useLocalRating: boolean = false
	): SpreadResultV2 {
		return spreadV2(places, vipPlaces, bounds, canvas, sizesConfig, categoriesCoefficients, useLocalRating);
	}

	public getPlacesDestinationMap(placeIds: string[], imageSize: string): Promise<Map<string, Place>> {
		return getPlacesDestinationMap(placeIds, imageSize);
	}

	public getPlaceAutoTranslation(placeId: string): Promise<PlaceAutoTranslation> {
		return getPlaceAutoTranslation(placeId);
	}
}
