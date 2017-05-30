// SPEC: https://confluence.sygic.com/display/STV/Transit+Modes+Limits
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { TransportMode } from '../Trip';

const PEDESTRIAN_OPTIMAL_MAX: number = 5000;
const CAR_OPTIMAL_MAX: number = 1000000;

const PEDESTRIAN_LIMIT_MAX: number = 50000;
const CAR_LIMIT_MAX: number = 2000000;
const PLANE_LIMIT_MIN: number = 50000;

export const selectOptimalMode = (origin: Location, destination: Location): TransportMode => {
	const distance = getDistance(origin, destination, EARTH_RADIUS);
	if (distance <= PEDESTRIAN_OPTIMAL_MAX) {
		return 'pedestrian';
	}
	if (distance <= CAR_OPTIMAL_MAX) {
		return 'car';
	}
	return 'plane';
};

export const getAvailableModes = (origin: Location, destination: Location): TransportMode[] => {
	const distance = getDistance(origin, destination, EARTH_RADIUS);
	const modes: TransportMode[] = [];
	if (distance <= PEDESTRIAN_LIMIT_MAX) {
		modes.push('pedestrian');
	}
	if (distance <= CAR_LIMIT_MAX) {
		modes.push('car');
	}
	if (distance > PLANE_LIMIT_MIN) {
		modes.push('plane');
	}
	return modes;
};
