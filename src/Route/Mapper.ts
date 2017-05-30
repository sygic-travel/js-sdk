import { camelizeKeys } from 'humps';
import { Direction, ModeSelector, Route, RouteRequest } from '.';
import { Location } from '../Geo';
import { ItineraryItem, TransportAvoid, TransportMode, TransportType } from '../Trip';

const toTranspotModesMapping = {
	driving: 'car',
	walking: 'pedestrian',
};

export const mapRouteFromApiResponse = (
	data,
	transportAvoid: TransportAvoid[],
	transportMode: TransportMode,
	transportType: TransportType|null
): Route => {
	const routeBuild: any = camelizeKeys(data);
	routeBuild.directions = routeBuild.directions.map( (direction): Direction => {
		direction.mode = toTranspotModesMapping[direction.mode] ? toTranspotModesMapping[direction.mode] : direction.mode;
		if (!direction.type) {
			direction.type = direction.mode === 'car' ? transportType : null;
		}
		if (!direction.avoid) {
			direction.avoid = direction.mode === 'car' ? transportAvoid : [];
		}
		return direction as Direction;
	});
	const route = routeBuild as Route;
	route.choosenDirection = chooseDirection(route.directions, transportMode, transportType);
	return route;
};

export const createRouteRequest = (
	itineraryItem: ItineraryItem,
	destination: Location,
	origin: Location
): RouteRequest => {
	const userMode: TransportMode|null = itineraryItem.transportFromPrevious && itineraryItem.transportFromPrevious.mode;
	return {
		origin,
		destination,
		waypoints: itineraryItem.transportFromPrevious ? itineraryItem.transportFromPrevious.waypoints : [],
		avoid: itineraryItem.transportFromPrevious ? itineraryItem.transportFromPrevious.avoid : [],
		type: itineraryItem.transportFromPrevious ? itineraryItem.transportFromPrevious.type : 'fastest',
		choosenMode: userMode ? userMode : ModeSelector.selectOptimalMode(origin, destination),
	} as RouteRequest;
};

const chooseDirection = (directions: Direction[], mode: TransportMode, type: TransportType|null): Direction => {
	return directions.reduce((choosen: Direction|null, direction: Direction): Direction => {
		if (choosen === null || (direction.mode === mode && (!type || type === direction.type))) {
			choosen = direction;
		}
		return choosen;
	}, null) as Direction;
};
