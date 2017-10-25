import { Location } from '../Geo';
import { getDirections, getRoutesForTripDay, Route, TripDayRoutes } from '../Route';

export default class RoutesModule {
	public getRoutesForTripDay(tripId: string, dayIndex: number): Promise<TripDayRoutes> {
		return getRoutesForTripDay(tripId, dayIndex);
	}

	public getDirections(origin: Location, destination: Location): Promise<Route> {
		return getDirections(origin, destination);
	}
}
