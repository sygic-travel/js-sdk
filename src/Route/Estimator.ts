import { encode } from '@mapbox/polyline';
import { Direction, ModeDirections } from '.';
import { Location } from '../Geo';
import { TransportMode } from '../Trip';
import { LocalizedDatetime } from '../Util';
import { DirectionLeg, DirectionMode } from './Route';

const CAR_SPEED_0_TO_20: number = 27;
const CAR_SPEED_20_TO_40: number = 54;
const CAR_SPEED_60_AND_MORE: number = 90;

const PEDESTRIAN_SPEED: number = 4.8;
const PLANE_SPEED: number = 900;

const CAR_MAX_DISTANCE: number = 2000000;
const PEDESTRIAN_MAX_DISTANCE: number = 20000;
const PLANE_MIN_DISTANCE: number = 100000;

export const estimateModeDirections = (
	modeDirections: ModeDirections[],
	origin: Location,
	destination: Location
): ModeDirections[] => {
	return Object.keys(TransportMode).reduce((acc: ModeDirections[], transportMode: string) => {
		const transportModeInDirections: ModeDirections | undefined = modeDirections.find((modeDirection: ModeDirections) => (
			modeDirection.mode === TransportMode[transportMode]
		));

		if (transportModeInDirections === undefined) {
			const newDirection: Direction = estimateDummyDirection(TransportMode[transportMode], origin, destination);
			acc.push({
				directions: newDirection ? [newDirection!] : [],
				mode: TransportMode[transportMode]
			});
		}

		return acc;
	}, []);
};

export const estimateCarDirection = (
	airDistance: number,
	origin: Location,
	destination: Location
): Direction | null => {
	if (airDistance > CAR_MAX_DISTANCE) {
		return null;
	}
	const direction: Direction = createDummyDirection(origin, destination);
	if (airDistance <= 2000) {
		direction.distance = Math.round(airDistance * 1.8);
	} else if (airDistance > 2000 && airDistance <= 6000) {
		direction.distance = Math.round(airDistance * 1.6);
	} else {
		direction.distance = Math.round(airDistance * 1.2);
	}

	let carSpeed = CAR_SPEED_60_AND_MORE;
	if (airDistance <= 20000) {
		carSpeed = CAR_SPEED_0_TO_20;
	} else if (airDistance > 20000 && airDistance <= 40000) {
		carSpeed = CAR_SPEED_20_TO_40;
	}

	direction.duration = Math.round((airDistance / carSpeed) * 3.6);
	direction.mode = TransportMode.CAR;
	return direction;
};

export const estimatePedestrianDirection = (
	airDistance: number,
	origin: Location,
	destination: Location
): Direction | null => {
	if (airDistance > PEDESTRIAN_MAX_DISTANCE) {
		return null;
	}
	const direction: Direction = createDummyDirection(origin, destination);
	if (airDistance <= 2000) {
		direction.distance = Math.round(airDistance * 1.35);
	} else if (airDistance > 2000 && airDistance <= 6000) {
		direction.distance = Math.round(airDistance * 1.22);
	} else {
		direction.distance = Math.round(airDistance * 1.106);
	}
	direction.duration = Math.round((airDistance / PEDESTRIAN_SPEED) * 3.6);
	direction.mode = TransportMode.PEDESTRIAN;
	return direction;
};

export const estimatePlaneDirection = (
	airDistance: number,
	origin: Location,
	destination: Location
): Direction | null => {
	if (airDistance < PLANE_MIN_DISTANCE) {
		return null;
	}
	const direction: Direction = createDummyDirection(origin, destination);
	direction.distance = airDistance;
	direction.duration = Math.round((airDistance / PLANE_SPEED) * 3.6 + 40 * 60);
	direction.mode = TransportMode.PLANE;
	return direction;
};

export const estimateDummyDirection = (
	transportMode: TransportMode,
	origin: Location,
	destination: Location
): Direction => {
	const direction: Direction = createDummyDirection(origin, destination);
	direction.mode = transportMode;
	return direction;
};

const createDummyDirection = (origin: Location, destination: Location): Direction => ({
	distance: null,
	duration: null,
	mode: TransportMode.CAR,
	avoid: [],
	source: 'estimator',
	routeId: null,
	attributions: [],
	legs: [{
		startTime: createDummyLocalizedDatetime(),
		endTime: createDummyLocalizedDatetime(),
		duration: null,
		distance: null,
		mode: DirectionMode.CAR,
		polyline: encode([[origin.lat, origin.lng], [destination.lat, destination.lng]]),
		origin: {
			name: null,
			location: origin,
			arrivalAt: createDummyLocalizedDatetime(),
			departureAt: createDummyLocalizedDatetime(),
			plannedArrivalAt: createDummyLocalizedDatetime(),
			plannedDepartureAt: createDummyLocalizedDatetime()
		},
		destination: {
			name: null,
			location: destination,
			arrivalAt: createDummyLocalizedDatetime(),
			departureAt: createDummyLocalizedDatetime(),
			plannedArrivalAt: createDummyLocalizedDatetime(),
			plannedDepartureAt: createDummyLocalizedDatetime()
		},
		intermediateStops: [],
		displayInfo: {
			agencyName: null,
			headsign: null,
			nameShort: null,
			nameLong: null,
			lineColor: null,
			displayMode: null
		}
	} as DirectionLeg]
});

const createDummyLocalizedDatetime = (): LocalizedDatetime => ({
	datetime: null,
	localDatetime: null
});
