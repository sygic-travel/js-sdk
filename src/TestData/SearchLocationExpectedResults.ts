/* tslint:disable */
import { Address, AddressFields, SearchResult } from '../Search/SearchResult';
import { Location } from '../Geo';
import { Category, Level, Place } from '../Places';
import { Detail } from '../Places/PlaceDetail';
import { MainMedia } from '../Media/Media';

export const searchLocations = [{
	type: 'city',
	location: {
		lat: -26.53032,
		lng: 22.98887
	} as Location,
	distance: 11215662,
	address: {
		full: 'Klein Eiffel, South Africa',
		short: 'Klein Eiffel, South Africa',
		fields: {
			name: null,
			houseNumber: null,
			street: null,
			city: 'Klein Eiffel',
			state: null,
			postalCode: null,
			country: 'South Africa'
		} as AddressFields
	} as Address,
	place: null
} as SearchResult, {
	type: 'poi',
	distance: 8555865,
	location: {
		lat: 49.84796,
		lng: 18.14732
	} as Location,
	address: {
		full: 'eiffel optic, Ostrava, Czech Republic',
		short: 'eiffel optic, Ostrava, Czech Republic',
		fields: {
			name: 'eiffel optic',
			houseNumber: null,
			street: null,
			city: 'Ostrava',
			state: null,
			postalCode: null,
			country: 'Czech Republic'
		} as AddressFields
	} as Address,
	place: {
		id: 'poi:203997',
		level: Level.POI,
		categories: [Category.SHOPPING],
		rating: 0.002,
		ratingLocal: 0.003,
		quadkey: '120213203332231310',
		location: {
			lat: 49.8479662,
			lng: 18.1473294
		},
		boundingBox: null,
		name: 'eiffel optic',
		nameSuffix: 'Ostrava, Czech Republic',
		nameLocal: 'eiffel optic',
		nameTranslated: null,
		nameEn: 'eiffel optic',
		perex: null,
		url: 'https://travel.sygic.com/go/poi:203997',
		thumbnailUrl: null,
		marker: 'shopping-optician',
		class: {
			slug: 'shopping:optician',
			name: 'Optician'
		},
		hotelStarRating: null,
		hotelStarRatingUnofficial: null,
		customerRating: null,
		parents: [],
		tagKeys: [
			'Optician'
		],
		detail: {
			tags: [{
				key: 'Optician',
				name: 'Optician'
			}],
			address: null,
			admission: null,
			area: null,
			durationEstimate: 3600,
			description: null,
			email: null,
			openingHoursNote: null,
			openingHoursRaw: null,
			phone: null,
			mainMedia: {
				square: null,
				videoPreview: null,
				portrait: null,
				landscape: null
			} as MainMedia,
			references: [],
			mediaCount: 1,
			satellite: null,
			attributes: null,
			timezone: null,
			hasShapeGeometry: false,
			collectionCount: 0
		} as Detail
	} as Place
} as SearchResult];
