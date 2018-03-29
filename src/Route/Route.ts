import { Location } from '../Geo';
import { TransportAvoid, TransportMode, TransportSettings } from '../Trip';

export interface TripDayRoutes {
	routes: Route[];
	userTransportSettings: (TransportSettings | null)[];
}

export interface Route {
	origin: Location;
	destination: Location;
	chosenDirection: Direction;
	modeDirections: ModeDirections[];
}

export interface Direction {
	distance: number | null;
	duration: number | null;
	polyline: string;
	routeId: string | null;
	mode: TransportMode;
	avoid: TransportAvoid[];
	source: DirectionSource;
	isoCodes: string[];
}

export interface ModeDirections {
	mode: TransportMode;
	directions: Direction[];
}

export interface RouteRequest {
	origin: Location;
	destination: Location;
	avoid: TransportAvoid[];
	chosenMode: TransportMode;
	waypoints?: Waypoint[];
	routeId?: string | null;
}

export type DirectionSource =
	'osrm' |
	'estimator' |
	'lbs';

export interface Waypoint {
	placeId: string | null;
	location: Location;
}

export enum DirectionSendResponseCode {
	OK = 'OK',
	ERROR_INVALID_INPUT = 'ERROR_INVALID_INPUT',
	ERROR = 'ERROR'
}
