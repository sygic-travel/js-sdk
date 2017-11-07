import * as queryString from 'querystring';
import { Airline, Airport, FlightSearchResult, FlightsQuery } from '.';
import { ApiResponse, KiwiApi } from '../Api';
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { getKiwiParnerId } from '../Settings';
import { mapFlights } from './Mapper';

const MAX_STOPOVER_BREAKING_DISTANCE = 8000 * 1000;
const DEFAULT_LANGUAGE = 'en';
const DEFAULT_CURRENCY = 'USD';
const AIRPORT_SEARCH_RADIUS = '250km';

let airlinesCache: Map<string, Airline>|null = null;

export async function getFlights(query: FlightsQuery): Promise<FlightSearchResult[]> {
	const date: Date = new Date(query.date);
	const dateString: string = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	let maxstopovers = 1;
	if (getDistance(query.origin, query.destination, EARTH_RADIUS) > MAX_STOPOVER_BREAKING_DISTANCE) {
		maxstopovers = 2;
	}
	query.language = query.language ? query.language : DEFAULT_LANGUAGE;
	query.currency = query.currency ? query.currency : DEFAULT_CURRENCY;
	const queryObject: any = {
		partner: getKiwiParnerId(),
		flyFrom: query.origin.lat.toFixed(2) + '-' + query.origin.lng.toFixed(2) + '-' + AIRPORT_SEARCH_RADIUS,
		to: query.destination.lat.toFixed(2) + '-' + query.destination.lng.toFixed(2) + '-' + AIRPORT_SEARCH_RADIUS,
		dateFrom: dateString,
		dateTo: dateString,
		curr: query.currency,
		locale: query.language,
		adults: query.adults,
		maxstopovers,
	};

	if (query.infants) {
		queryObject.infants = query.infants;
	}

	if (query.returnDate) {
		const rDate: Date = new Date(query.returnDate);
		const returnDateString: string = rDate.getDate() + '/' + (rDate.getMonth() + 1) + '/' + rDate.getFullYear();
		queryObject.returnFrom = returnDateString;
		queryObject.returnTo = returnDateString;
	}

	const response: ApiResponse = await KiwiApi.get(
		'https://api.skypicker.com/flights?' + queryString.stringify(queryObject)
	);

	const airportCodes: string[] = [];
	response.data.data.forEach((flight) => {
		if (airportCodes.indexOf(flight.flyTo) === -1) {
			airportCodes.push(flight.flyTo);
		}
		if (airportCodes.indexOf(flight.flyFrom) === -1) {
			airportCodes.push(flight.flyFrom);
		}
	});
	response.data.all_stopover_airports.forEach((code) => {
		if (airportCodes.indexOf(code) === -1) {
			airportCodes.push(code);
		}
	});
	const flightsData: any[] = response.data.data.sort((a, b) => {
		if (a.route.length < b.route.length) {
			return -1;
		}
		return 1;
	});

	const airportAirlinesLoading: Promise<any>[] = [];
	airportAirlinesLoading.push(getAirports(airportCodes, query.language!));
	airportAirlinesLoading.push(getAirlines());
	const airportAirlines = await Promise.all(airportAirlinesLoading);
	return mapFlights(flightsData, query, airportAirlines[0], airportAirlines[1]);
}

async function getAirports(codes: string[], language: string): Promise<Map<string, Airport>> {
	const loadings = codes.map((code) => {
		const query = {
			type: 'id',
			id: code,
			locale: KiwiApi.localeMap[language],
		};
		return KiwiApi.get('https://locations.skypicker.com?' + queryString.stringify(query));
	});
	const result = await Promise.all(loadings);
	const airports = new Map<string, Airport>();
	result.forEach((response) => {
		const data = response.data.locations[0];
		const airport: Airport = {
			name: data.name,
			cityName: data.city.name,
			iata: data.id,
			location: {
				lat: data.location.lat,
				lng: data.location.lon
			} as Location
		};
		airports.set(data.id, airport);
	});
	return airports;
}

async function getAirlines(): Promise<Map<string, Airline>> {
	if (airlinesCache) {
		return airlinesCache;
	}
	const response: ApiResponse = await KiwiApi.get('https://api.skypicker.com/airlines');
	const airlines: Map<string, Airline> = new Map<string, Airline>();
	response.data.forEach((airlineData) => {
		airlines.set(airlineData.id, {
			id: airlineData.id,
			name: airlineData.name,
			logo: `https://images.kiwi.com/airlines/64/${airlineData.id}.png`
		} as Airline);
	});
	airlinesCache = airlines;
	return airlines;
}
