import { Location } from '../Geo';
import { TransportAvoid, TransportMode, TransportSettings } from '../Trip';

export interface TripDayRoutes {
	routes: Route[];
	userTransportSettings: (TransportSettings|null)[];
}

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
	waypoints?: Waypoint[];
	avoid: TransportAvoid[];
	chosenMode: TransportMode;
}

export type DirectionSource =
	'osrm' |
	'estimator' |
	'lbs';

export interface Waypoint {
	placeId: string|null;
	location: Location;
}
