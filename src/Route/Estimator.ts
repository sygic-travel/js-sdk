import { encode } from '@mapbox/polyline';
import { Direction } from '.';
import { EARTH_RADIUS, getDistance, Location } from '../Geo';

const PLANE_SPEED: number = 900;

export const estimatePlaneDirection = (origin: Location, destination: Location): Direction => {
	const distance = getDistance(origin, destination, EARTH_RADIUS);
	return {
		distance,
		duration: Math.round((distance / PLANE_SPEED) * 3.6 + 3 * 40 * 60),
		polyline: encode([[origin.lat, origin.lng], [destination.lat, destination.lng]]),
		mode: 'plane',
		type: 'fastest',
		avoid: [],
		source: 'estimator',
		isoCodes: [],
	} as Direction;
};
