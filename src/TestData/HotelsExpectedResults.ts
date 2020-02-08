import { Location } from '../Geo';
import { Hotel } from '../Hotels';
import { Place } from '../Places';

export const hotels = [{
		place : {
			id: 'hotel:12345',
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
			nameLocal: null,
			nameTranslated: null,
			nameEn: null,
			hotelStarRating: 4,
			hotelStarRatingUnofficial: null,
			customerRating: 8.6,
			boundingBox: null,
			perex: 'This 14-century bridge connects the Old Town with Lesser Town and the Prague Castle.' +
			' With its length of 621 meters, solid Gothic stone…',
			url: 'https://alpha.travel.sygic.com/go/poi:345430',
			thumbnailUrl: 'https://alpha-media-cdn.sygictraveldata.com/media/poi:345430',
			marker: 'sightseeing:art:artwork',
			categories: ['sightseeing'],
			parents: [
				{
					"id": "poi:1294",
					"name": "Champ de Mars",
					"level": null
				},
				{
					"id": "poi:28009821",
					"name": "7th arrondissement of Paris",
					"level": "neighbourhood"
				},
				{
					"id": "city:14",
					"name": "Paris",
					"level": "city"
				},
				{
					"id": "region:303",
					"name": "Île-de-France",
					"level": "state"
				},
				{
					"id": "country:14",
					"name": "France",
					"level": "country"
				},
				{
					"id": "continent:1",
					"name": "Europe",
					"level": "continent"
				}
			],
			detail: null
		} as Place,
		bookingCom: {
			price: 169.47,
			hotelId: '1201343',
			availableRoomsCount: 5
		}
	} as Hotel
];

export const availableHotels = {
	hotels,
	roomFacilities: [{
		name: 'Bath',
		key: 'bath'
	}],
	hotelFacilities: [{
		name: 'Restaurant',
		key: 'restaurant'
	}],
};
