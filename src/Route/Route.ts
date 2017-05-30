import { Location } from '../Geo';
import { TransportAvoid, TransportMode, TransportType } from '../Trip';

export interface Route {
	origin: Location;
	destination: Location;
	choosenDirection: Direction;
	directions: Direction[];
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

export interface RouteRequest {
	origin: Location;
	destination: Location;
	waypoints?: Location[];
	avoid: TransportAvoid[];
	type: TransportType;
	choosenMode: TransportMode;
}

export type DirectionSource =
	'osrm' |
	'estimator' |
	'lbs';
