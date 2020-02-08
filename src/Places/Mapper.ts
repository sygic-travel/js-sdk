import { camelizeKeys } from 'humps';

import { Bounds, Location } from '../Geo';
import { MainMedia, Medium } from '../Media';
import { DetailedPlace, Place, Parent, PlaceClass } from './Place';
import { AddressDetails, Detail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { PlaceOpeningHours } from './PlaceOpeningHours';
import {
	PlaceReview,
	PlaceReviewFromYelp,
	PlaceReviewsData,
	PlaceReviewsFromYelpData
} from './PlaceReview';

export const mapPlaceApiResponseToPlaces = (places: any): Place[] => {
	return places.map((place) => {
		return mapPlace(place, null);
	});
};

export const mapPlaceDetailedApiResponseToPlace = (place: any, photoSize: string): DetailedPlace => {
	const detail = mapPlaceDetail(place, photoSize);
	return mapPlace(place, detail);
};

export const mapPlaceDetailedBatchApiResponseToPlaces = (places: any, photoSize: string): DetailedPlace[] => {
	return places.map((place) => mapPlaceDetailedApiResponseToPlace(place, photoSize));
};

export const mapPlace = (place, detail: Detail | null) => {
	return {
		id: place.id,
		level: place.level,
		rating: place.rating,
		ratingLocal: place.rating_local,
		location: place.location as Location,
		quadkey: place.quadkey,
		name: place.name,
		nameSuffix: place.name_suffix,
		nameLocal: place.name_local,
		nameTranslated: place.name_translated,
		nameEn: place.name_en,
		boundingBox: place.bounding_box as Bounds,
		perex: place.perex,
		url: place.url,
		thumbnailUrl: place.thumbnail_url,
		marker: place.marker,
		class: place.class as PlaceClass,
		categories: place.categories,
		parents: place.parents as Parent[],
		hotelStarRating: place.hotel_star_rating,
		hotelStarRatingUnofficial: place.hotel_star_rating_unofficial,
		customerRating: place.customer_rating,
		tagKeys: place.tag_keys,
		detail
	} as DetailedPlace;
};

const mapPlaceDetail = (place, photoSize): Detail => {
	const tags: Tag[] = place.tags.map((tag) => (camelizeKeys(tag) as Tag));
	const references: Reference[] = place.references.map((reference) => camelizeKeys(reference));
	const resultPlaceDetail = {
		tags,
		address: place.address,
		admission: place.admission,
		area: place.area,
		description: place.description ? {
			provider: place.description.provider,
			translationProvider: place.description.translation_provider,
			text: place.description.text,
			url: place.description.link,
			languageId: place.description.language_id
		} : null,
		email: place.email,
		durationEstimate: place.duration_estimate,
		openingHoursNote: place.opening_hours_note,
		openingHoursRaw: place.opening_hours_raw,
		mediaCount: place.media_count,
		phone: place.phone,
		mainMedia: mapMainMediaToMedia(camelizeKeys(place.main_media), photoSize),
		satellite: place.satellite ? {
			imageUrl: place.satellite.image_url,
			boundingBox: place.satellite.bounding_box as Bounds
		} : null,
		references,
		attributes: place.attributes,
		timezone: place.timezone,
		hasShapeGeometry: place.has_shape_geometry,
		collectionCount: place.collection_count,
		addressDetails: place.address_details as AddressDetails
	} as Detail;

	if (place.owner_id) {
		resultPlaceDetail.ownerId = place.owner_id;
	}

	return resultPlaceDetail;
};

export const mapMainMediaToMedia = (mainMedia, photoSize: string): MainMedia => {
	const mappedMedia: MainMedia = {
		square: null,
		videoPreview: null,
		portrait: null,
		landscape: null
	};
	if (mainMedia) {
		Object.keys(mainMedia.usage).forEach((key) => {
			const mediaId = mainMedia.usage[key];
			mappedMedia[key] = mainMedia.media.reduce((acc, item) => {
				if (item.id === mediaId) {
					return {
						original: item.original,
						suitability: item.suitability,
						urlTemplate: item.urlTemplate,
						urlWithSize: item.urlTemplate.replace(/{size}/i, photoSize),
						type: item.type,
						url: item.url,
						attribution: item.attribution,
						id: item.id,
						location: item.location
					} as Medium;
				}
				return acc;
			}, null);
		});
	}

	return mappedMedia as MainMedia;
};

export const mapPlaceGeometryApiResponseToPlaceGeometry = (placeGeometry: any): PlaceGeometry => ({
		geometry: placeGeometry.geometry as GeoJSON.GeoJsonObject,
		isShape: placeGeometry.is_shape
	} as PlaceGeometry
);

export const mapPlaceOpeningHours = (placeOpeningHours: any): PlaceOpeningHours => ({
		openingHours: placeOpeningHours.opening_hours ? placeOpeningHours.opening_hours : null
	} as PlaceOpeningHours
);

export const mapPlaceReview = (placeReview: any): PlaceReview => {
	return camelizeKeys(placeReview) as PlaceReview;
};

export const mapPlaceReviewsData = (placeReviewsData: any): PlaceReviewsData => {
	return {
		rating: placeReviewsData.rating,
		currentUserHasReview: placeReviewsData.current_user_has_review,
		reviews: placeReviewsData.reviews.map((placeReview: any) => mapPlaceReview(placeReview))
	} as PlaceReviewsData;
};

export const mapPlaceReviewFromYelp = (placeReview: any): PlaceReviewFromYelp => {
	return camelizeKeys(placeReview) as PlaceReviewFromYelp;
};

export const mapPlaceReviewsFromYelpData = (placeReviewsData: any): PlaceReviewsFromYelpData => {
	return {
		rating: placeReviewsData ? placeReviewsData.rating : 0,
		totalCount: placeReviewsData ? placeReviewsData.total_count : 0,
		reviews: placeReviewsData ? placeReviewsData.reviews.map(
			(placeReview: any) => mapPlaceReviewFromYelp(placeReview)
		) : []
	} as PlaceReviewsFromYelpData;
};
