import { Location } from '../Geo';
import * as Media from '../Media/Media';
import { Place } from '../Places/Place';
import { Description, PlaceDetail, Reference, Tag } from '../Places/PlaceDetail';
import { PlaceReview } from '../Places/PlaceReview';
import { PlaceReviewsData } from '../Places/PlaceReviewsData';
import { PlacesStats, SumStatistic } from '../Places/Stats';

/* tslint:disable */
export const placeDetailedEiffelTowerWithoutMedia: Place = {
	id: 'poi:530',
	level: 'poi',
	marker: 'sightseeing:tower:lookout:observation',
	starRating: 4,
	starRatingUnofficial: null,
	customerRating: 8.6,
	rating: 7.9110977331847,
	location: {
		lat: 48.858262,
		lng: 2.2944955
	} as Location,
	quadkey: '120220011012000332',
	name: 'Eiffel Tower',
	nameSuffix: 'Paris, France',
	boundingBox: null,
	perex: 'Built by Gustave Eiffel for the 1889 World’s Fair, Eiffel Tower became the world\'s tallest man-made structure until the Chrysler Building…',
	url: 'https://travel.sygic.com/go/poi:530',
	thumbnailUrl: 'https://media-cdn.sygictraveldata.com/media/poi:530',
	categories: ['sightseeing'],
	parents: ['city:14', 'region:303', 'country:14', 'continent:1'],
	detail: {
		tags: [
			{
				key: 'Fodor\'s',
				name: 'Fodor\'s'
			} as Tag,
			{
				key: 'World\'s Fair Architecture',
				name: 'World\'s Fair Architecture'
			} as Tag,
			{
				key: 'Historical',
				name: 'Historical'
			} as Tag
		],
		address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
		admission: 'Lift entrance ticket* / to the top / by stairs*\nAdults: €11 / €17 / €7 \nYouth (12 - 24): €8.50 / €14.50 / €5\nChildren (4 - 11), disabled: €4 / €8 / €3\n*valid to 2nd floor\n\nThe access waiting time to the monument is likely to be over 2 hours unless you book online.\n\nAn extra ticket for the top floor may be purchased on the 2nd floor, depending on weather conditions.',
		description: {
			text: 'Built by Gustave Eiffel for the 1889 World’s Fair, Eiffel Tower became the world\'s tallest man-made structure until the Chrysler Building in New York was finished in 1930. Although it is one of the world\'s most visited tourist attractions now, it was not accepted well by the French at the time. Also, it was supposed to be taken down after 20 years since it was meant to be only a temporary exhibit. Fortunately, Gustave Eiffel convinced the government to keep the construction and use it as a radiotelegraph station.\n\nThere are 1,665 steps leading to the top, but you can take the stairs only to the second floor. A lift takes you to the top floor. Originally, only the second floor was open to the public, but now all three levels are accessible and boast award-winning restaurants. In the evening, Eiffel Tower is illuminated with 20,000 light bulbs.\n\nPlease note that there are no locker rooms, so do not bring large baggage or pushchairs if you cannot fold them.',
			provider: null,
			translationProvider: null,
			link: 'www.travel.sygic.com',
			isTranslated: true
		} as Description,
		email: null,
		duration: 3600,
		openingHours: 'Open daily:\nMid-June - early Sep: 9 a.m. - 12:45 a.m. \nLast lift at midnight (11 p.m. to the top).\nStairs: 9 a.m. - 12:45 a.m. \n(Last admission at midnight.)\n\nRest of the year: 9:30 a.m. - 11:45 p.m. \nLast lift at 11 p.m. (10:30 p.m. to the top).\nStairs: 9:30 a.m. - 6:30 p.m. \n(Last admission at 6 p.m.)',
		phone: '+33 892 70 12 39',
		media: {
			square: null,
			videoPreview: null,
			portrait: null,
			landscape: null,
		} as Media.MainMedia,
		references: [{
			id: 1470551,
			title: 'Wikipedia',
			type: 'wiki',
			languageId: 'en',
			url: 'https://en.wikipedia.org/wiki/Eiffel_Tower',
			offlineFile: null,
			supplier: 'wiki',
			priority: 0,
			isPremium: false,
			currency: null,
			price: null,
			flags: []
		} as Reference,{
			id: 1303032,
			title: 'Eiffel Tower Dinner and Seine River Cruise',
			type: 'tour:vehicle:boat',
			languageId: 'en',
			url: 'http://www.partner.viator.com/en/13008/tours/Paris/Eiffel-Tower-Dinner-and-Seine-River-Cruise/d479-2050TEC',
			offlineFile: null,
			supplier: 'viator',
			priority: 1000,
			isPremium: false,
			currency: 'USD',
			price: 182.88,
			flags: []
		} as Reference],
		ownerId: '12345'
	} as PlaceDetail
};

export const places = [{
	id: 'poi:345430',
	level: 'poi',
	rating: 10.004,
	location: {
		lat: 50.0866003,
		lng: 14.4105518
	} as Location,
	quadkey: '120212302033311321',
	name: 'Charles Bridge',
	nameSuffix: 'Prague, Czech Republic',
	boundingBox: null,
	perex: 'This 14-century bridge connects the Old Town with Lesser Town and the Prague Castle. With its length of 621 meters, solid Gothic stone…',
	url: 'https://alpha.travel.sygic.com/go/poi:345430',
	thumbnailUrl: 'https://alpha-media-cdn.sygictraveldata.com/media/poi:345430',
	marker: 'sightseeing:art:artwork',
	starRating: 4,
	starRatingUnofficial: null,
	customerRating: 8.6,
	categories: ['sightseeing'],
	parents: ['city:5', 'region:26009', 'region:26011', 'country:5', 'continent:1'],
	detail: null
} as Place];

export const mappedMedia = {
	square: {
		original: {
			size: 9511064,
			width: 4114,
			height: 4235
		} as Media.Original,
		suitability: ['square'],
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383632393531',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d383632393531',
		createdAt: '2015-03-17T14:48:02+0000',
		source: {
			provider: 'wikipedia',
			name: 'Wikimedia Commons',
			externalId: 'File:Paris - Eiffelturm und Marsfeld2.jpg'
		} as Media.Source,
		type: 'photo',
		createdBy: 'x',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d383632393531.jpg',
		quadkey: null,
		attribution: {
			titleUrl: 'http://commons.wikimedia.org/wiki/File:Paris_-_Eiffelturm_und_Marsfeld2.jpg',
			license: 'CC BY 3.0',
			other: null,
			authorUrl: 'http://commons.wikimedia.org/wiki/User:Taxiarchos228',
			author: 'Wladyslaw',
			title: 'Paris: The Eiffel Tower and the Champ de Mars',
			licenseUrl: 'http://creativecommons.org/licenses/by/3.0'
		} as Media.Attribution,
		id: 'm:62951',
		location: null
	} as Media.Medium,
	portrait: {
		original: {
			size: 872649,
			width: 2048,
			height: 3072
		},
		suitability: ['portrait'],
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383336353933333937',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d383336353933333937',
		createdAt: '2017-04-19T12:00:34+0000',
		source: {
			provider: 'wikipedia',
			name: 'Wikimedia Commons',
			externalId: 'File:Tour Eiffel - 20150801 13h38 (10610).jpg'
		} as Media.Source,
		type: 'photo',
		createdBy: '53d8a9428f8ff',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d383336353933333937.jpg',
		quadkey: '120220011012003000',
		attribution: {
			titleUrl: 'https://commons.wikimedia.org/wiki/File:Tour_Eiffel_-_20150801_13h38_(10610).jpg',
			license: 'CC BY-SA 4.0',
			other: null,
			authorUrl: 'http://commons.wikimedia.org/wiki/User:Medium69',
			author: 'Medium69',
			title: 'Southeast face of the Eiffel Tower in Paris.',
			licenseUrl: 'http://creativecommons.org/licenses/by-sa/4.0'
		} as Media.Attribution,
		id: 'm:36593397',
		location: {
			lat: 48.856733,
			lng: 2.297
		} as Location
	} as Media.Medium,
	landscape: {
		original: {
			size: 676805,
			width: 2048,
			height: 1536
		} as Media.Original,
		suitability: ['landscape'],
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d3832343230303032',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d3832343230303032',
		createdAt: '1970-01-01T00:00:00+0000',
		source: {
			provider: 'wikipedia',
			name: 'Wikimedia Commons',
			externalId: 'File:Tour Eiffel, Paris.JPG'
		} as Media.Source,
		type: 'photo',
		createdBy: '53d8a9428f8ff',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d3832343230303032.jpg',
		quadkey: '120220011012000332',
		attribution: {
			titleUrl: 'http://commons.wikimedia.org/wiki/File:Tour_Eiffel,_Paris.JPG',
			license: 'CC BY-SA 3.0',
			other: null,
			authorUrl: 'http://commons.wikimedia.org/wiki/User:Amarena7',
			author: 'Amarena7',
			title: 'Tour Eiffel',
			licenseUrl: 'http://creativecommons.org/licenses/by-sa/3.0'
		} as Media.Attribution,
		id: 'm:2420002',
		location: {
			lat: 48.858333,
			lng: 2.294444
		} as Location
	} as Media.Medium,
	videoPreview: null
} as Media.MainMedia;

export const placeReview = {
	id: 1,
	userId: '4ff1a1c21977d',
	userName: 'Test',
	itemGuid: 'poi:530',
	message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
	rating: 4,
	votesUp: 5,
	votesDown: 1,
	votesScore: 4,
	currentUserVote: 1,
	createdAt: '2017-01-30T09:09:45+01:00',
	updatedAt: '2017-02-30T09:09:45+01:00'
} as PlaceReview;

export const placeReviewsData = {
	rating: 10,
	currentUserHasReview: false,
	reviews: [{
		id: 1,
		userId: '4ff1a1c21977d',
		userName: 'Test',
		itemGuid: 'poi:530',
		message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		rating: 4,
		votesUp: 5,
		votesDown: 1,
		votesScore: 4,
		currentUserVote: 1,
		createdAt: '2017-01-30T09:09:45+01:00',
		updatedAt: '2017-02-30T09:09:45+01:00'
	} as PlaceReview, {
		id: 2,
		userId: '4ff1a1c21977d',
		userName: 'Test',
		itemGuid: 'poi:530',
		message: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit.',
		rating: 4,
		votesUp: 5,
		votesDown: 1,
		votesScore: 4,
		currentUserVote: 1,
		createdAt: '2017-01-30T09:09:45+01:00',
		updatedAt: '2017-02-30T09:09:45+01:00'
	} as PlaceReview]
} as PlaceReviewsData;

export const placesStatsData = {
	categories: [
		{
			key: "shopping",
			name: "Shopping",
			count: 10
		} as SumStatistic, {
			key: "eating",
			name: "eating",
			count: 100
		} as SumStatistic
	],
	tags: [
		{
			key: "market",
			name: "market",
			count: 10
		} as SumStatistic, {
			key: "kfc",
			name: "KFC",
			count: 100
		} as SumStatistic
	],
} as PlacesStats;

export const customPlace = {
		id: 'c:1',
		level: 'poi',
		rating: 0,
		location: {
			lat: -18.894964,
			lng: 47.51632
		} as Location,
		quadkey: '301022033120323222',
		boundingBox: null,
		name: 'Antananarivo',
		nameSuffix: null,
		url: null,
		categories: [],
		marker: 'default',
		starRating: null,
		starRatingUnofficial: null,
		customerRating: null,
		parents: [],
		perex: '',
		thumbnailUrl: null,
		detail: {
			tags: [],
			address: null,
			admission: null,
			duration: 3600,
			email: null,
			openingHours: null,
			phone: null,
			media: {
				landscape: null,
				portrait: null,
				square: null,
				videoPreview: null
			},
			references: [],
			ownerId: '4d945cecbe65e',
			description: null
		}
} as Place;
/* tslint:enable */
