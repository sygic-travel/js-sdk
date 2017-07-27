import * as cloneDeep from 'lodash.clonedeep';

import { Day, ItineraryItem, Trip, TripMedia, TripPrivileges } from '../Trip/Trip';
import { placeDetailedEiffelTowerWithoutMedia } from './PlacesExpectedResults';

/* tslint:disable */
export const tripList = [{
	id: '58c6bce821287',
	ownerId: '5759530f6e5f6',
	name: 'Výlet do Amsterdam',
	version: 33,
	privacyLevel: 'shareable',
	url: 'https://alpha.travel.sygic.com/go/trip:58c6bce821287',
	startsOn: '2017-04-08',
	endsOn: '2017-04-10',
	updatedAt: '2017-04-09T06:42:25+00:00',
	days: null,
	isDeleted: false,
	privileges: {
		'delete': true,
		edit: true,
		manage: true
	} as TripPrivileges,
	media: {
		square: {
			id: 'm:29619755',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383239363139373535'
		},
		landscape: {
			id: 'm:1672336',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d3831363732333336'
		},
		portrait: {
			id: 'm:29619765',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383239363139373635'
		},
		videoPreview: null
	} as TripMedia
} as Trip];

const itineraryPlace1 = cloneDeep(placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace2 = cloneDeep(placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace3 = cloneDeep(placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace4 = cloneDeep(placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace5 = cloneDeep(placeDetailedEiffelTowerWithoutMedia);
itineraryPlace1.id = 'poi:1';
itineraryPlace2.id = 'poi:2';
itineraryPlace3.id = 'poi:3';
itineraryPlace4.id = 'poi:4';
itineraryPlace5.id = 'poi:5';

export const itineratyItem = {
	placeId: 'poi:1',
	place: itineraryPlace1,
	startTime: null,
	duration: null,
	note: null,
	transportFromPrevious: null,
	isSticky: false,
};

export const tripDetailed = {
	id: '58c6bce821287',
	ownerId: '5759530f6e5f6',
	name: 'Výlet do Amsterdam',
	version: 33,
	url: 'https://alpha.travel.sygic.com/go/trip:58c6bce821287',
	updatedAt: '2017-04-09T06:42:25+00:00',
	isDeleted: false,
	privacyLevel: 'shareable',
	privileges: {
		edit: true,
		manage: true,
		'delete': true
	} as TripPrivileges,
	startsOn: "2017-04-08",
	endsOn: "2017-04-10",
	days: [
		{
			itinerary: [{
					placeId: 'poi:1',
					place: itineraryPlace1,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: false,
				} as ItineraryItem,
				{
					placeId: 'poi:2',
					place: itineraryPlace2,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				} as ItineraryItem
			],
			note: null,
			date: "2017-04-08"
		} as Day,
		{
			itinerary: [{
					placeId: 'poi:2',
					place: itineraryPlace2,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				} as ItineraryItem,
				{
					placeId: 'poi:3',
					place: itineraryPlace3,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: false
				} as ItineraryItem,
			],
			note: null,
			date: "2017-04-09"
		} as Day,
		{
			itinerary: [{
					placeId: 'poi:4',
					place: itineraryPlace4,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: false
				} as ItineraryItem,
				{
					placeId: 'poi:5',
					place: itineraryPlace5,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: false
				} as ItineraryItem
			],
			note: null,
			date: "2017-04-10"
		} as Day,
	],
	media: {
		square: {
			id: 'm:29619755',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383239363139373535'
		},
		landscape: {
			id: 'm:1672336',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d3831363732333336'
		},
		portrait: {
			id: 'm:29619765',
			urlTemplate: 'https://alpha-media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383239363139373635'
		},
		videoPreview: null
	} as TripMedia
} as Trip;
/* tslint:enable */
