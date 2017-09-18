import { camelizeKeys } from 'humps';

import { Location } from '../Geo';
import { Bounds } from '../Geo/Bounds';
import { MainMedia } from '../Media/Media';
import { Place } from './Place';
import { Description, PlaceDetail, Reference, Tag } from './PlaceDetail';
import { PlaceGeometry } from './PlaceGeometry';
import { PlaceOpeningHours } from './PlaceOpeningHours';
import { PlaceReview } from './PlaceReview';
import { PlaceReviewsData } from './PlaceReviewsData';

const defaultPhotoSize = '300x300';

export const mapPlaceApiResponseToPlaces = (places: any): Place[] => {
	return places.map((place) => {
		return mapPlace(place, null);
	});
};

export const mapPlaceDetailedApiResponseToPlace = (place: any, photoSize: string): Place => {
	const detail = mapPlaceDetail(place, photoSize);
	return mapPlace(place, detail);
};

export const mapPlaceDetailedBatchApiResponseToPlaces = (places: any, photoSize: string): Place[] => {
	return places.map((place) => {
		const detail = mapPlaceDetail(place, photoSize);
		return mapPlace(place, detail);
	});
};

export const mapPlace = (place, detail: PlaceDetail | null) => {
	return {
		id: place.id,
		level: place.level,
		rating: place.rating,
		location: place.location as Location,
		quadkey: place.quadkey,
		name: place.name,
		nameSuffix: place.name_suffix,
		boundingBox: place.bounding_box as Bounds,
		perex: place.perex,
		url: place.url,
		thumbnailUrl: place.thumbnail_url,
		marker: place.marker,
		categories: place.categories,
		parents: place.parent_ids,
		starRating: place.star_rating,
		starRatingUnofficial: place.star_rating_unofficial,
		customerRating: place.customer_rating,
		detail
	} as Place;
};

const mapPlaceDetail = (place, photoSize): PlaceDetail => {
	const tags: Tag[] = place.tags.map((tag) => (camelizeKeys(tag) as Tag));
	const description: Description | null = place.description ? camelizeKeys(place.description) as Description : null;
	const references: Reference[] = place.references.map((reference) => camelizeKeys(reference));
	const resultPlaceDetail = {
		tags,
		address: place.address,
		admission: place.admission,
		description,
		email: place.email,
		duration: place.duration,
		openingHours: place.opening_hours,
		phone: place.phone,
		media: mapMainMediaToMedia(camelizeKeys(place.main_media), photoSize),
		references
	} as PlaceDetail;

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
					item.urlWithSize = item.urlTemplate.replace(/{size}/i, photoSize || defaultPhotoSize);
					return item;
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

export const mapPlaceOpeningHours = (placeOpeningHours: any): PlaceOpeningHours => {
	return placeOpeningHours as PlaceOpeningHours;
};

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
