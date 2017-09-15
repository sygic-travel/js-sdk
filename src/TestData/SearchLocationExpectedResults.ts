/* tslint:disable */
import { Address, AddressFields, SearchResult } from '../Search/SearchResult';
import { Location } from '../Geo';
import { Place } from '../Places';
import { PlaceDetail } from '../Places/PlaceDetail';
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
		level: 'poi',
		categories: ['shopping'],
		rating: 0.002,
		quadkey: '120213203332231310',
		location: {
			lat: 49.8479662,
			lng: 18.1473294
		},
		boundingBox: null,
		name: 'eiffel optic',
		nameSuffix: 'Ostrava, Czech Republic',
		perex: null,
		url: 'https://travel.sygic.com/go/poi:203997',
		thumbnailUrl: null,
		marker: 'shopping:optician',
		starRating: null,
		starRatingUnofficial: null,
		customerRating: null,
		parents: [],
		detail: {
			tags: [{
				key: 'Optician',
				name: 'Optician'
			}],
			address: null,
			admission: null,
			duration: 3600,
			description: null,
			email: null,
			openingHours: null,
			phone: null,
			media: {
				square: null,
				videoPreview: null,
				portrait: null,
				landscape: null
			} as MainMedia,
			references: []
		} as PlaceDetail
	} as Place
} as SearchResult];
