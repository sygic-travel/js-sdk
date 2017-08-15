import { Bounds, Location } from '../Geo';
import { Medium } from '../Media';
import {
	addPlaceReview,
	deletePlaceReview,
	detectParentsByBounds,
	detectParentsByLocation,
	getPlaceDetailed,
	getPlaceGeometry,
	getPlaceMedia,
	getPlaceOpeningHours,
	getPlaceReviews,
	getPlaces,
	getPlacesDetailed,
	getPlacesStats,
	Place,
	PlaceGeometry,
	PlaceOpeningHours,
	PlaceReview,
	PlaceReviewsData,
	PlacesListFilter,
	PlacesListFilterJSON,
	PlacesStats,
	PlacesStatsFilter,
	PlacesStatsFilterJSON,
	voteOnReview
} from '../Places';
import { CanvasSize, spread, SpreadResult, SpreadSizeConfig } from '../Spread';
import {
	CategoriesCoefficients,
	spread as spreadV2,
	SpreadResult as SpreadResultV2,
	SpreadSizeConfig as SpreadSizeConfigV2
} from '../SpreadV2';

export default class PlacesModule {
	public getPlaces(filter: PlacesListFilterJSON): Promise<Place[]> {
		return getPlaces(new PlacesListFilter(filter));
	}

	public getPlaceDetailed(id: string, photoSize: string): Promise<Place> {
		return getPlaceDetailed(id, photoSize);
	}

	public getPlacesDetailed(ids: string[], photoSize: string): Promise<Place[]> {
		return getPlacesDetailed(ids, photoSize);
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
		categoriesCoefficients?: CategoriesCoefficients | null
	): SpreadResultV2 {
		return spreadV2(places, vipPlaces, bounds, canvas, sizesConfig, categoriesCoefficients);
	}
}
