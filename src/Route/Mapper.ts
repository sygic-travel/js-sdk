import { camelizeKeys } from 'humps';
import { Direction, ModeDirections, ModeSelector, Route, RouteRequest } from '.';
import { Location } from '../Geo';
import { ItineraryItem, TransportAvoid, TransportMode, TransportSettings, TransportType } from '../Trip';

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
	transportMode: TransportMode,
	transportType: TransportType|null
): Route => {
	const routeBuild: any = camelizeKeys(data);
	routeBuild.directions = routeBuild.directions.map((direction): Direction => {
		direction.mode = toTranspotModesMapping[direction.mode] ? toTranspotModesMapping[direction.mode] : direction.mode;
		if (!direction.type) {
			direction.type = direction.mode === 'car' ? transportType : null;
		}
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
	route.chosenDirection = choseDirection(route.modeDirections, transportMode, transportType);
	return route as Route;
};

export const createRouteRequest = (
	destination: Location,
	origin: Location,
	itineraryItem?: ItineraryItem
): RouteRequest => {

	const userMode: TransportMode | null =
		itineraryItem ? itineraryItem.transportFromPrevious && itineraryItem.transportFromPrevious.mode : null;
	const transportFromPrevious: TransportSettings | null =
		itineraryItem ? itineraryItem.transportFromPrevious : null;

	return {
		origin,
		destination,
		waypoints: transportFromPrevious ? transportFromPrevious.waypoints : [],
		avoid: transportFromPrevious ? transportFromPrevious.avoid : ['unpaved'],
		type: transportFromPrevious ? transportFromPrevious.type : 'fastest',
		chosenMode: userMode ? userMode : ModeSelector.selectOptimalMode(origin, destination),
	} as RouteRequest;
};

export const choseDirection = (
	modeDirectionsSet: ModeDirections[],
	mode: TransportMode,
	type: TransportType|null
): Direction => {
	return modeDirectionsSet.reduce((chosen: Direction|null, modeDirection: ModeDirections): Direction => {
		if (chosen === null || (modeDirection.mode === mode && !type)) {
			chosen = modeDirection.directions[0];
		}
		if (modeDirection.mode === mode && type) {
			const found = modeDirection.directions.find((direction: Direction) => (type === direction.type));
			if (found) {
				chosen = found;
			}
		}
		return chosen;
	}, null) as Direction;
};
