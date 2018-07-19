import { Location, NamedLocation } from '../Geo';
import {
	DirectionSendResponseCode, getDirections, getRoutesForTripDay,
	Route, sendDirections, TripDayRoutes, Waypoint
} from '../Route';
import { TransportAvoid, TransportMode } from '../Trip';

export default class RoutesModule {
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<TripDayRoutes> {
		return getRoutesForTripDay(tripId, dayIndex);
	}

	public getDirections(
		origin: Location,
		destination: Location,
		waypoints: Waypoint[],
		avoids: TransportAvoid[],
		at?: string | null,
		mode?: TransportMode
	): Promise<Route | null> {
		return getDirections(origin, destination, waypoints, avoids, at, mode);
	}

	public sendDirections(
		email: string,
		destination: NamedLocation,
		origin?: NamedLocation,
		waypoints?: Waypoint[],
		avoid?: TransportAvoid[]
	): Promise<DirectionSendResponseCode> {
		return sendDirections(email, destination, origin, waypoints, avoid);
	}
}
