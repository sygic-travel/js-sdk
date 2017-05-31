import { Location } from '../Geo';
import { TransportAvoid, TransportMode, TransportType } from '../Trip';

export interface Route {
	origin: Location;
	destination: Location;
	chosenDirection: Direction;
	modeDirections: ModeDirections[];
}

export interface Direction {
	distance: number;
	duration: number;
	polyline: string;
	mode: TransportMode;
	type: TransportType;
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
	waypoints?: Location[];
	avoid: TransportAvoid[];
	type: TransportType;
	chosenMode: TransportMode;
}

export type DirectionSource =
	'osrm' |
	'estimator' |
	'lbs';
