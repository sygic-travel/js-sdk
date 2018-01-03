import { encode } from '@mapbox/polyline';
import { Airline, Airport, Flight, FlightSearchResult, FlightsQuery, Route } from '.';

export function mapFlights(
	data,
	query: FlightsQuery,
	airports: Map<string, Airport>,
	airlines: Map<string, Airline>
): FlightSearchResult[] {
	return data.map((flight) => {
		let inbound: Flight | null = null;
		if (flight.routes[1]) {
			inbound = buildFlight(
				flight.routes[1],
				flight.duration.return,
				flight.route.filter((route) => (route.return)),
				airports,
				airlines
			);
		}
		return {
			outbound: buildFlight(
				flight.routes[0],
				flight.duration.departure,
				flight.route.filter((route) => (!route.return)),
				airports,
				airlines
			),
			price: flight.price,
			currency: query.currency,
			deepLink: flight.deep_link,
			inbound
		} as FlightSearchResult;
	});
}

function buildFlight(
	routeData,
	duration: number,
	routes,
	airports: Map<string, Airport>,
	airlines: Map<string, Airline>,
): Flight {
	const flightRoutes: Route[] = [];
	for (let i = 0; i < routes.length; i++) {
		const arrivalTime = new Date();
		const departureTime = new Date();
		arrivalTime.setTime(routes[i].aTime * 1000);
		departureTime.setTime(routes[i].dTime * 1000);
		let stopOver: number | null = null;
		if (flightRoutes[i - 1]) {
			stopOver = (departureTime.getTime() - flightRoutes[i - 1].arrivalTime.getTime()) / 1000;
		}
		flightRoutes.push({
			origin: airports.get(routes[i].flyFrom),
			destination: airports.get(routes[i].flyTo),
			flightNo: routes[i].flight_no,
			airline: airlines.get(routes[i].airline),
			polyline: encode([[routes[i].latFrom, routes[i].lngFrom], [routes[i].latTo, routes[i].lngTo]]),
			arrivalTime,
			departureTime,
			stopOver
		} as Route);
	}
	return {
		origin: airports.get(routeData[0]) as Airport,
		destination: airports.get(routeData[1]) as Airport,
		duration,
		routes: flightRoutes
	};
}
