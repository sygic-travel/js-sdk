// SPEC: https://confluence.sygic.com/display/STV/Transit+Modes+Limits
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { TransportMode } from '../Trip';

const PEDESTRIAN_OPTIMAL_MAX: number = 2000;
const CAR_OPTIMAL_MAX: number = 1000000;

export const selectOptimalMode = (origin: Location, destination: Location): TransportMode => {
	const distance = getDistance(origin, destination, EARTH_RADIUS);
	if (distance <= PEDESTRIAN_OPTIMAL_MAX) {
		return TransportMode.PEDESTRIAN;
	}
	if (distance <= CAR_OPTIMAL_MAX) {
		return TransportMode.CAR;
	}
	return TransportMode.PLANE;
};
