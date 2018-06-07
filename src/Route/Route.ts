import { Location } from '../Geo';
import { TransportAvoid, TransportMode, TransportSettings } from '../Trip';
import { LocalizedDatetime } from '../Util';

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
	routeId: string | null;
	mode: TransportMode;
	avoid: TransportAvoid[];
	source: DirectionSource;
	transferCount?: number;
	legs?: DirectionLeg[];
	attributions: DirectionAttribution[];
}

export interface DirectionLeg {
	startTime: LocalizedDatetime;
	endTime: LocalizedDatetime;
	duration: number | null;
	distance: number | null;
	mode: DirectionMode;
	polyline: string;
	origin: DirectionLegTransferStation;
	destination: DirectionLegTransferStation;
	intermediateStops: DirectionLegTransferStation[];
	displayInfo: DirectionLegDisplayInfo;
}

export interface DirectionLegTransferStation {
	name: string | null;
	location: Location;
	arrivalAt: LocalizedDatetime;
	departureAt: LocalizedDatetime;
	plannedArrivalAt: LocalizedDatetime;
	plannedDepartureAt: LocalizedDatetime;
}

export enum DirectionMode {
	BIKE = 'bike',
	BOAT = 'boat',
	BUS = 'bus',
	CAR = 'car',
	FUNICULAR = 'funicular',
	PEDESTRIAN = 'pedestrian',
	PLANE = 'plane',
	RAIL = 'rail',
	SUBWAY = 'subway',
	TAXI = 'taxi',
	TRAIN = 'train',
	TRAM = 'tram'
}

export interface DirectionLegDisplayInfo {
	agencyName: string | null;
	headsign: string | null;
	nameShort: string | null;
	nameLong: string | null;
	lineColor: string | null;
	displayMode: string | null;
}

export interface DirectionAttribution {
	name: string | null;
	url: string | null;
	logoUrl: string | null;
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
	departAt: string | null;
	arriveAt: string | null;
}

export type DirectionSource =
	'osrm' |
	'estimator' |
	'lbs' |
	'otp' |
	'navitia';

export interface Waypoint {
	placeId: string | null;
	location: Location;
}

export enum DirectionSendResponseCode {
	OK = 'OK',
	ERROR_INVALID_INPUT = 'ERROR_INVALID_INPUT',
	ERROR = 'ERROR'
}
