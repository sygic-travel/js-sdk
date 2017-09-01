import { Location } from '../Geo';
import { getDirections, Route } from '../Route';

export default class RoutesModule {
	public getDirections(origin: Location, destination: Location): Promise<Route> {
		return getDirections(origin, destination);
	}
}
