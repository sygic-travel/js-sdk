import { Location } from '../Geo';
import { Suitability, Type } from '../Media';
import * as Media from '../Media/Media';
import {
	Category,
	Description,
	Detail,
	Level,
	Place,
	PlaceReview,
	PlaceReviewFromYelp,
	PlaceReviewFromYelpUser,
	PlaceReviewsData,
	PlaceReviewsFromYelpData,
	Reference,
	Tag
} from '../Places';
import { PlacesStats, SumStatistic } from '../Places/Stats';

/* tslint:disable */
export const placeDetailedEiffelTowerWithoutMedia: Place = {
	id: 'poi:530',
	level: Level.POI,
	marker: 'sightseeing:tower:lookout:observation',
	starRating: 4,
	starRatingUnofficial: null,
	customerRating: 8.6,
	rating: 7.9110977331847,
	ratingLocal: 8.9110977331847,
	location: {
		lat: 48.858262,
		lng: 2.2944955
	} as Location,
	quadkey: '120220011012000332',
	name: 'Eiffel Tower',
	nameSuffix: 'Paris, France',
	originalName: 'Eiffel Tower',
	boundingBox: null,
	perex: 'Built by Gustave Eiffel for the 1889 World’s Fair, Eiffel Tower became the world\'s tallest man-made structure until the Chrysler Building…',
	url: 'https://travel.sygic.com/go/poi:530',
	thumbnailUrl: 'https://media-cdn.sygictraveldata.com/media/poi:530',
	categories: [Category.SIGHTSEEING],
	parentIds: ['city:14', 'region:303', 'country:14', 'continent:1'],
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
		area: 100,
		description: {
			text: 'Built by Gustave Eiffel for the 1889 World’s Fair, Eiffel Tower became the world\'s tallest man-made structure until the Chrysler Building in New York was finished in 1930. Although it is one of the world\'s most visited tourist attractions now, it was not accepted well by the French at the time. Also, it was supposed to be taken down after 20 years since it was meant to be only a temporary exhibit. Fortunately, Gustave Eiffel convinced the government to keep the construction and use it as a radiotelegraph station.\n\nThere are 1,665 steps leading to the top, but you can take the stairs only to the second floor. A lift takes you to the top floor. Originally, only the second floor was open to the public, but now all three levels are accessible and boast award-winning restaurants. In the evening, Eiffel Tower is illuminated with 20,000 light bulbs.\n\nPlease note that there are no locker rooms, so do not bring large baggage or pushchairs if you cannot fold them.',
			provider: null,
			translationProvider: null,
			url: 'www.travel.sygic.com',
			isTranslated: true
		} as Description,
		email: null,
		duration: 3600,
		openingHoursNote: 'Open daily:\nMid-June - early Sep: 9 a.m. - 12:45 a.m. \nLast lift at midnight (11 p.m. to the top).\nStairs: 9 a.m. - 12:45 a.m. \n(Last admission at midnight.)\n\nRest of the year: 9:30 a.m. - 11:45 p.m. \nLast lift at 11 p.m. (10:30 p.m. to the top).\nStairs: 9:30 a.m. - 6:30 p.m. \n(Last admission at 6 p.m.)',
		openingHoursRaw: null,
		phone: '+33 892 70 12 39',
		mediaCount: 0,
		mainMedia: {
			square: null,
			videoPreview: null,
			portrait: null,
			landscape: null,
		} as Media.MainMedia,
		satellite: null,
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
	} as Detail
};

export const places = [{
	id: 'poi:345430',
	level: 'poi',
	rating: 10.004,
	ratingLocal: 10.004,
	location: {
		lat: 50.0866003,
		lng: 14.4105518
	} as Location,
	quadkey: '120212302033311321',
	name: 'Charles Bridge',
	nameSuffix: 'Prague, Czech Republic',
	originalName: 'Charles Bridge',
	boundingBox: null,
	perex: 'This 14-century bridge connects the Old Town with Lesser Town and the Prague Castle. With its length of 621 meters, solid Gothic stone…',
	url: 'https://alpha.travel.sygic.com/go/poi:345430',
	thumbnailUrl: 'https://alpha-media-cdn.sygictraveldata.com/media/poi:345430',
	marker: 'sightseeing:art:artwork',
	starRating: 4,
	starRatingUnofficial: null,
	customerRating: 8.6,
	categories: ['sightseeing'],
	parentIds: ['city:5', 'region:26009', 'region:26011', 'country:5', 'continent:1'],
	detail: null
} as Place];

export const mappedMedia = {
	square: {
		original: {
			size: 9511064,
			width: 4114,
			height: 4235
		} as Media.Original,
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383632393531',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d383632393531',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d383632393531.jpg',
		suitability: [Suitability.SQUARE],
		type: Type.PHOTO,
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
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d383336353933333937',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d383336353933333937',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d383336353933333937.jpg',
		suitability: [Suitability.PORTRAIT],
		type: Type.PHOTO,
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
		urlTemplate: 'https://media-cdn.sygictraveldata.com/media/{size}/612664395a40232133447d33247d3832343230303032',
		urlWithSize: 'https://media-cdn.sygictraveldata.com/media/400x400/612664395a40232133447d33247d3832343230303032',
		url: 'https://media-cdn.sygictraveldata.com/media/612664395a40232133447d33247d3832343230303032.jpg',
		suitability: [Suitability.LANDSCAPE],
		type: Type.PHOTO,
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
	placeId: 'poi:530',
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
		placeId: 'poi:530',
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
		placeId: 'poi:530',
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

export const placeReviewsFromYelpData = {
	rating: 4.5,
	totalCount: 1757,
	reviews: [{
		id: "FfVeoayE4GEIWJt5A",
		url: "https://www.yelp.com/",
		text: "Simply gorgeous! What can I say about this place that hasn't been said? My friends and I were going to make a reservation at the restaurant up top, but they...",
		rating: 5,
		createdAt: "2018-11-07T07:24:21-08:00",
		user: {
			id: "LRlX1OauoWqfW6aaGzQ",
			profileUrl: "https://www.yelp.com/user/LRlX1OauoWqfW6aaGzQ",
			imageUrl: "https://www.yelp.com/user/LRlX1OauoWqfW6aaGzQ.jpg",
			name: "Tester"
		} as PlaceReviewFromYelpUser
	} as PlaceReviewFromYelp,
	{
		id: "rkxnO9p4I0HAyEKrvw",
		url: "https://www.yelp.com/",
		text: "So it's a little bittersweet to not be giving this a five star review since it was a dream come true for myself coming to Paris as one of my first travel...",
		rating: 3,
		createdAt: "2018-11-01T15:22:37-08:00",
		user: {
			id: "qnm8V8dAaTphlYCg",
			profileUrl: "https://www.yelp.com/user/qnm8V8dAaTphlYCg",
			imageUrl: "https://www.yelp.com/user/qnm8V8dAaTphlYCg.jpg",
			name: "Julie E."
		} as PlaceReviewFromYelpUser
	} as PlaceReviewFromYelp,
	{
		id: "eWlO6TAC8h5RiQ",
		url: "https://www.yelp.com/",
		text: "La Tour Eiffel. The Eiffel Tower to most Americans. It is a sight to behold. I usually don't do a lot of...",
		rating: 5,
		createdAt: "2018-10-30T18:45:01-08:00",
		user: {
			id: "OVvMzuVCPEJYfOkhg",
			profileUrl: "https://www.yelp.com/user/OVvMzuVCPEJYfOkhg",
			imageUrl: "https://www.yelp.com/user/OVvMzuVCPEJYfOkhg.jpg",
			name: "Nikki E."
		} as PlaceReviewFromYelpUser
	} as PlaceReviewFromYelp]
} as PlaceReviewsFromYelpData;

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
		level: Level.POI,
		rating: 0,
		ratingLocal: 0,
		location: {
			lat: -18.894964,
			lng: 47.51632
		} as Location,
		quadkey: '301022033120323222',
		boundingBox: null,
		name: 'Antananarivo',
		nameSuffix: null,
		originalName: null,
		url: null,
		categories: [],
		marker: 'default',
		starRating: null,
		starRatingUnofficial: null,
		customerRating: null,
		parentIds: [],
		perex: '',
		thumbnailUrl: null,
		detail: {
			tags: [],
			address: null,
			area: null,
			admission: null,
			duration: 3600,
			email: null,
			openingHoursNote: null,
			openingHoursRaw: null,
			phone: null,
			mediaCount: 0,
			mainMedia: {
				landscape: null,
				portrait: null,
				square: null,
				videoPreview: null
			},
			satellite: null,
			references: [],
			ownerId: '4d945cecbe65e',
			description: null
		}
} as Place;
/* tslint:enable */
