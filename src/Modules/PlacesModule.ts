import { Bounds, Location } from '../Geo';
import { Medium } from '../Media';
import {
	addPlaceReview,
	deletePlaceReview,
	detectParentsByBounds,
	detectParentsByLocation,
	getDetailedPlace,
	getDetailedPlaces,
	getPlaceAttributes,
	getPlaceAutoTranslation,
	getPlaceGeometry,
	getPlaceMedia,
	getPlaceOpeningHours,
	getPlaceReviews,
	getPlaceReviewsFromYelp,
	getPlaces,
	getPlacesDestinationMap,
	getPlacesStats,
	Place,
	PlaceAttributes,
	PlaceAutoTranslation,
	PlaceGeometry,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewsData,
	PlaceReviewsFromYelpData,
	PlacesListFilterJSON,
	PlacesQuery,
	PlacesStats,
	PlacesStatsFilter,
	PlacesStatsFilterJSON,
	voteOnReview
} from '../Places';
import {
	CanvasSize,
	CategoriesCoefficients,
	spread,
	SpreadResult,
	SpreadSizeConfig
} from '../Spread';

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

	public getPlaceReviewsFromYelp(placeId: string): Promise<PlaceReviewsFromYelpData> {
		return getPlaceReviewsFromYelp(placeId);
	}

	public voteOnReview(reviewId: number, voteValue: number): Promise<void> {
		return voteOnReview(reviewId, voteValue);
	}

	/**
	 * @experimental
	 */
	public spreadPlacesOnMap(
		places: Place[],
		vipPlaces: Place[],
		bounds: Bounds,
		canvas: CanvasSize,
		sizesConfig?: SpreadSizeConfig[],
		categoriesCoefficients?: CategoriesCoefficients | null,
		useLocalRating: boolean = false
	): SpreadResult {
		return spread(places, vipPlaces, bounds, canvas, sizesConfig, categoriesCoefficients, useLocalRating);
	}

	public getPlacesDestinationMap(placeIds: string[], imageSize: string): Promise<Map<string, Place>> {
		return getPlacesDestinationMap(placeIds, imageSize);
	}

	public getPlaceAttributes(placeId: string): Promise<PlaceAttributes> {
		return getPlaceAttributes(placeId);
	}

	public getPlaceAutoTranslation(placeId: string): Promise<PlaceAutoTranslation> {
		return getPlaceAutoTranslation(placeId);
	}
}
