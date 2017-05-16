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
		delete: true,
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

const itineraryPlace1 = Object.assign({}, placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace2 = Object.assign({}, placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace3 = Object.assign({}, placeDetailedEiffelTowerWithoutMedia);
const itineraryPlace4 = Object.assign({}, placeDetailedEiffelTowerWithoutMedia);
itineraryPlace1.id = 'poi:51098';
itineraryPlace2.id = 'poi:48056';
itineraryPlace3.id = 'poi:48015';
itineraryPlace4.id = 'poi:48071';

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
		delete: true
	} as TripPrivileges,
	startsOn: "2017-04-08",
	endsOn: "2017-04-10",
	days: [
		{
			itinerary: [{
					placeId: 'poi:51098',
					place: itineraryPlace1,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem,
				{
					placeId: 'poi:48056',
					place: itineraryPlace2,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem,
				{
					placeId: 'poi:48015',
					place: itineraryPlace3,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem,
				{
					placeId: 'poi:48071',
					place: itineraryPlace4,
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem
			],
			note: null
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
