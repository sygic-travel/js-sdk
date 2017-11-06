import { Location } from '../Geo';
import { Direction, Route } from '../Route';

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
		distance: 800,
		duration: 30,
		routeId: '30:800',
		polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
		mode: 'car',
		avoid: [],
		source: 'lbs',
		isoCodes: [ 'CZ', 'SK' ]
	} as Direction,
	modeDirections: [
		{
			mode: 'pedestrian',
			directions: [
				{
					distance: 530,
					duration: 300,
					routeId: null,
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvA',
					mode: 'pedestrian',
					source: 'osrm',
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				} as Direction
			]
		},
		{
			mode: 'car',
			directions: [
				{
					distance: 800,
					duration: 30,
					routeId: '30:800',
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
					mode: 'car',
					source: 'lbs',
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				} as Direction,
				{
					distance: 700,
					duration: 30,
					routeId: '30:700',
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
					mode: 'car',
					source: 'lbs',
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				} as Direction
			]
		},
	]
} as Route;
