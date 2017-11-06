import { camelizeKeys } from 'humps';
import { Direction, ModeDirections, ModeSelector, Route, RouteRequest } from '.';
import { Location } from '../Geo';
import { TransportAvoid, TransportMode } from '../Trip';
import { Waypoint } from './Route';

const toTranspotModesMapping = {
	driving: 'car',
	walking: 'pedestrian',
};

const MODES_ORDER: TransportMode[] = [
	'plane',
	'car',
	'pedestrian'
];

export const mapRouteFromApiResponse = (
	data,
	transportAvoid: TransportAvoid[],
	transportMode: TransportMode
): Route => {
	const routeBuild: any = camelizeKeys(data);
	routeBuild.directions = routeBuild.directions.map((direction): Direction => {
		direction.mode = toTranspotModesMapping[direction.mode] ? toTranspotModesMapping[direction.mode] : direction.mode;
		if (!direction.avoid) {
			direction.avoid = direction.mode === 'car' ? transportAvoid : [];
		}
		return direction as Direction;
	});
	routeBuild.modeDirections = routeBuild.directions.reduce((
		mDirectionsSet: ModeDirections[],
		direction: Direction): ModeDirections[] => {
			let modeDirections = mDirectionsSet.find((mDirections: ModeDirections) => (mDirections.mode === direction.mode));
			if (!modeDirections) {
				modeDirections = { mode: direction.mode, directions: []};
				mDirectionsSet.push(modeDirections);
			}
			modeDirections.directions.push(direction);
			return mDirectionsSet;

	}, []).sort((a: ModeDirections, b: ModeDirections): number => {
		const aIndex: number = MODES_ORDER.indexOf(a.mode);
		const bIndex: number = MODES_ORDER.indexOf(b.mode);
		if (aIndex < bIndex) {
			return 1;
		} else if (aIndex > bIndex) {
			return -1;
		}
		return 0;
	});
	delete routeBuild.directions;
	const route = routeBuild as Route;
	route.chosenDirection = chooseDirection(route.modeDirections, transportMode);
	return route as Route;
};

export const createRouteRequest = (
	destination: Location,
	origin: Location,
	routeId: string|null = null,
	waypoints?: Waypoint[],
	avoid?: TransportAvoid[],
	mode?: TransportMode,
): RouteRequest => {
	return {
		origin,
		destination,
		waypoints: waypoints ? waypoints : [],
		avoid: avoid ? avoid : ['unpaved'],
		chosenMode: mode ? mode : ModeSelector.selectOptimalMode(origin, destination),
		routeId
	} as RouteRequest;
};

export const chooseDirection = (
	modeDirectionsSet: ModeDirections[],
	mode: TransportMode,
	routeId: string|null = null,
): Direction => {
	let chosen: Direction|null = null;
	for (const modeDirection of modeDirectionsSet) {
		if (chosen === null || (modeDirection.mode === mode && !routeId)) {
			chosen = modeDirection.directions[0];
		}
		if (modeDirection.mode === mode && routeId) {
			const found = modeDirection.directions.find((direction: Direction) => (routeId === direction.routeId));
			if (found) {
				chosen = found;
			}
		}
	}
	return chosen!;
};
