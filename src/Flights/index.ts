import * as Dao from './DataAccess';
import { Airline, Airport, Flight, FlightSearchResult, FlightsQuery, isOvernight, Route } from './Flight';

export {
	Airline,
	Airport,
	Flight,
	FlightsQuery,
	FlightSearchResult,
	isOvernight,
	Route,
};

export async function getFlights(query: FlightsQuery): Promise<FlightSearchResult[]> {
	if (!query.adults) {
		query.adults = 2;
	}
	return Dao.getFlights(query);
}
