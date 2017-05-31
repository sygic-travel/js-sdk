import { Location } from '../Geo';
import { Route } from '../Route';

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
		polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
		mode: 'car',
		type: 'fastest',
		avoid: [],
		source: 'lbs',
		isoCodes: [ 'CZ', 'SK' ]
	},
	modeDirections: [
		{
			mode: 'pedestrian',
			directions: [
				{
					distance: 530,
					duration: 300,
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvA',
					mode: 'pedestrian',
					source: 'osrm',
					type: null,
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				}
			]
		},
		{
			mode: 'car',
			directions: [
				{
					distance: 800,
					duration: 30,
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
					mode: 'car',
					source: 'lbs',
					type: 'fastest',
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				},
				{
					distance: 700,
					duration: 30,
					polyline: 'emjkHgjfdBZoHkEoDkDwCe@sBi@_Di@dCZbCzCvAemjkHgjfdBZoHkEoDkDwCe',
					mode: 'car',
					source: 'lbs',
					type: 'shortest',
					avoid: [],
					isoCodes: [ 'CZ', 'SK' ]
				}
			]
		},
	]
} as Route;
