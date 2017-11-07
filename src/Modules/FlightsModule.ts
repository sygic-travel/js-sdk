import {
	FlightSearchResult,
	FlightsQuery,
	getFlights
} from '../Flights';

/**
 * @experimental
 */
export default class FlightsModule {
	public getFlights(query: FlightsQuery): Promise<FlightSearchResult[]> {
		return getFlights(query);
	}
}
