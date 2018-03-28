import { Location } from '../Geo';
import {
	DirectionSendResponseCode, getDirections, getRoutesForTripDay,
	Route, sendDirections, TripDayRoutes, Waypoint
} from '../Route';
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

	public sendDirections(
		email: string,
		destinationLocation: Location,
		destinationName: string | null = null
	): Promise<DirectionSendResponseCode> {
		return sendDirections(email, destinationLocation, destinationName);
	}
}
