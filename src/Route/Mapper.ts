import { camelizeKeys } from 'humps';
import { Direction, ModeDirections, Route, RouteRequest } from '.';
import { Location } from '../Geo';
import { TransportAvoid, TransportMode } from '../Trip';
import { LocalizedDatetime } from '../Util';
import { DirectionLeg, DirectionLegTransferStation, Waypoint } from './Route';

const toTransportModesMapping = {
	driving: TransportMode.CAR,
	walking: TransportMode.PEDESTRIAN,
};

export const mapRouteFromApiResponse = (
	data,
	transportAvoid: TransportAvoid[],
): Route => {
	const routeBuild: any = camelizeKeys(data);
	routeBuild.directions = routeBuild.directions.map((direction): Direction => {
		direction.mode = toTransportModesMapping[direction.mode] ? toTransportModesMapping[direction.mode] : direction.mode;
		if (!direction.avoid) {
			direction.avoid = direction.mode === TransportMode.CAR ? transportAvoid : [];
		}
		direction.legs = direction.legs.map(mapDirectionLegFromApiResponse);
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

	}, []);
	delete routeBuild.directions;
	return routeBuild as Route;
};

export const createRouteRequest = (
	destination: Location,
	origin: Location,
	routeId: string | null = null,
	departAt: string | null,
	waypoints?: Waypoint[],
	avoid?: TransportAvoid[],
	mode?: TransportMode,
): RouteRequest => {
	return {
		origin,
		destination,
		waypoints: waypoints ? waypoints : [],
		avoid: avoid ? avoid : [TransportAvoid.UNPAVED],
		chosenMode: mode || null,
		routeId,
		departAt: departAt ? departAt : null,
		arriveAt: null
	} as RouteRequest;
};

export const chooseDirection = (
	modeDirectionsSet: ModeDirections[],
	mode: TransportMode,
	routeId: string | null = null,
): Direction => {
	let chosen: Direction | null = null;
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

const mapDirectionLegFromApiResponse = (directionLegFromApi: any): DirectionLeg => ({
		startTime: mapLocalizedDateTimeFromApiResponse(directionLegFromApi.startTime),
		endTime: mapLocalizedDateTimeFromApiResponse(directionLegFromApi.endTime),
		duration: directionLegFromApi.duration,
		distance: directionLegFromApi.distance,
		mode: directionLegFromApi.mode,
		polyline: directionLegFromApi.polyline,
		origin: mapDirectionLegTransferStation(directionLegFromApi.origin),
		destination: mapDirectionLegTransferStation(directionLegFromApi.destination),
		intermediateStops: directionLegFromApi.intermediateStops.map(mapDirectionLegTransferStation),
		displayInfo: directionLegFromApi.displayInfo
});

const mapDirectionLegTransferStation = (directionLegTransferStationFromApi: any): DirectionLegTransferStation => ({
	name: directionLegTransferStationFromApi.name,
	location: directionLegTransferStationFromApi.location,
	arrivalAt: mapLocalizedDateTimeFromApiResponse(directionLegTransferStationFromApi.arrivalAt),
	departureAt: mapLocalizedDateTimeFromApiResponse(directionLegTransferStationFromApi.departureAt),
	plannedArrivalAt: mapLocalizedDateTimeFromApiResponse(directionLegTransferStationFromApi.plannedArrivalAt),
	plannedDepartureAt: mapLocalizedDateTimeFromApiResponse(directionLegTransferStationFromApi.plannedDepartureAt)
});

const mapLocalizedDateTimeFromApiResponse = (localizedDatetimeFromApi: {
	datetime: string | null,
	datetimeLocal: string | null
}): LocalizedDatetime => ({
	datetime: localizedDatetimeFromApi.datetime,
	localDatetime: localizedDatetimeFromApi.datetimeLocal
});
