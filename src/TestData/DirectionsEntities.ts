import { Location } from '../Geo';
import { Direction, Route } from '../Route';
import { DirectionMode } from '../Route/Route';
import { TransportMode } from '../Trip';
import { LocalizedDatetime } from '../Util';

const emptyLocalDateTime = {
	datetime: null,
	localDatetime: null
} as LocalizedDatetime;

export const route = {
	origin: {
		lat: 49.2080811,
		lng: 16.582698
	} as Location,
	destination: {
		lat: 49.2080844,
		lng: 16.582545
	} as Location,
	chosenDirection: {
		distance: 530,
		duration: 300,
		routeId: null,
		mode: TransportMode.PEDESTRIAN,
		avoid: [],
		source: 'osrm',
		attributions: [],
		transferCount: 0,
		legs: [{
			startTime: emptyLocalDateTime,
			endTime: emptyLocalDateTime,
			distance: 530,
			duration: 300,
			mode: DirectionMode.PEDESTRIAN,
			polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvA',
			origin: {
				name: null,
				location: {
					lat: 49.2080811,
					lng: 16.582698
				},
				arrivalAt: emptyLocalDateTime,
				departureAt: emptyLocalDateTime,
				plannedArrivalAt: emptyLocalDateTime,
				plannedDepartureAt: emptyLocalDateTime
			},
			destination: {
				name: null,
				location: {
					lat: 49.2080844,
					lng: 16.582545
				},
				arrivalAt: emptyLocalDateTime,
				departureAt: emptyLocalDateTime,
				plannedArrivalAt: emptyLocalDateTime,
				plannedDepartureAt: emptyLocalDateTime
			},
			intermediateStops: [],
			displayInfo: {
				nameShort: null,
				nameLong: null,
				headsign: null,
				lineColor: null,
				displayMode: null
			},
			attribution: null
		}]
	} as Direction,
	modeDirections: [
		{
			mode: TransportMode.PEDESTRIAN,
			directions: [
				{
					distance: 530,
					duration: 300,
					routeId: null,
					mode: TransportMode.PEDESTRIAN,
					source: 'osrm',
					avoid: [],
					attributions: [],
					transferCount: 0,
					legs: [{
						startTime: emptyLocalDateTime,
						endTime: emptyLocalDateTime,
						distance: 530,
						duration: 300,
						mode: DirectionMode.PEDESTRIAN,
						polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvA',
						origin: {
							name: null,
							location: {
								lat: 49.2080811,
								lng: 16.582698
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						destination: {
							name: null,
							location: {
								lat: 49.2080844,
								lng: 16.582545
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						intermediateStops: [],
						displayInfo: {
							nameShort: null,
							nameLong: null,
							headsign: null,
							lineColor: null,
							displayMode: null
						},
						attribution: null
					}]
				} as Direction
			]
		},
		{
			mode: TransportMode.CAR,
			directions: [
				{
					distance: 800,
					duration: 30,
					routeId: '30:800',
					mode: TransportMode.CAR,
					source: 'lbs',
					avoid: [],
					attributions: [],
					transferCount: 0,
					legs: [{
						startTime: emptyLocalDateTime,
						endTime: emptyLocalDateTime,
						distance: 800,
						duration: 30,
						mode: DirectionMode.CAR,
						polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
						origin: {
							name: null,
							location: {
								lat: 49.2080811,
								lng: 16.582698
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						destination: {
							name: null,
							location: {
								lat: 49.2080844,
								lng: 16.582545
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						intermediateStops: [],
						displayInfo: {
							nameShort: null,
							nameLong: null,
							headsign: null,
							lineColor: null,
							displayMode: null
						},
						attribution: null
					}]
				} as Direction,
				{
					distance: 700,
					duration: 30,
					routeId: '30:700',
					mode: TransportMode.CAR,
					source: 'lbs',
					avoid: [],
					attributions: [],
					transferCount: 0,
					legs: [{
						startTime: emptyLocalDateTime,
						endTime: emptyLocalDateTime,
						distance: 700,
						duration: 30,
						mode: DirectionMode.CAR,
						polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
						origin: {
							name: null,
							location: {
								lat: 49.2080811,
								lng: 16.582698
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						destination: {
							name: null,
							location: {
								lat: 49.2080844,
								lng: 16.582545
							},
							arrivalAt: emptyLocalDateTime,
							departureAt: emptyLocalDateTime,
							plannedArrivalAt: emptyLocalDateTime,
							plannedDepartureAt: emptyLocalDateTime
						},
						intermediateStops: [],
						displayInfo: {
							nameShort: null,
							nameLong: null,
							headsign: null,
							lineColor: null,
							displayMode: null
						},
						attribution: null
					}]
				} as Direction
			]
		},
	]
} as Route;
