import { Location } from '../Geo';

export interface FlightSearchResult {
	price: number;
	currency: string;
	deepLink: string;
	outbound: Flight;
	inbound: Flight|null;
}

export interface Airport {
	location: Location;
	name: string;
	cityName: string;
	iata: string;
}

export interface Flight {
	origin: Airport;
	destination: Airport;
	routes: Route[];
	duration: number;
}

export interface Route {
	origin: Airport;
	destination: Airport;
	flightNo: number;
	airline: Airline;
	departureTime: Date;
	arrivalTime: Date;
	polyline: string;
	stopOver: number|null;
}

export interface FlightsQuery {
	origin: Location;
	destination: Location;
	date: string;
	returnDate: string;
	currency?: string;
	language?: string;
	adults?: number;
	infants?: number;
}

export interface Airline {
	name: string;
	logo: string;
	id: string;
}

export function isOvernight(flight: Flight) {
	const departure: Date = flight.routes[0].departureTime;
	const arrival: Date = flight.routes[flight.routes.length - 1].arrivalTime;
	return departure.getDay() !== arrival.getDay();
}
