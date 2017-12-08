import { Location } from '../Geo';
import { getDirections, getRoutesForTripDay, Route, TripDayRoutes, Waypoint } from '../Route';
import { TransportAvoid } from '../Trip';

export default class RoutesModule {
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<TripDayRoutes> {
		return getRoutesForTripDay(tripId, dayIndex);
	}

	public getDirections(
		origin: Location,
		destination: Location,
		waypoints: Waypoint[],
		avoids: TransportAvoid[]
	): Promise<Route | null> {
		return getDirections(origin, destination, waypoints, avoids);
	}
}
