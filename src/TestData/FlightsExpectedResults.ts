import { Airport, FlightSearchResult, Route } from '../Flights';

export const result = {
	price: 651,
	deepLink: 'https://kiwi.com/deep?from=PRG&to=DXB&departure=22-11-2017&return=25-11-2017&flightsId=123',
	currency: 'USD',
	outbound: {
		origin: {
			name: 'Václav Havel Airport Prague',
			cityName: 'Prague',
			iata: 'PRG',
			location: {
				lat: 50.1008333,
				lng: 14.26
			}
		} as Airport,
		destination: {
			name: 'Dubai International',
			cityName: 'Dubai',
			iata: 'DXB',
			location: {
				lat: 25.2527778,
				lng: 55.3644444
			}
		} as Airport,
		duration: 29700,
		routes: [
			{
				origin: {
					name: 'Václav Havel Airport Prague',
					cityName: 'Prague',
					iata: 'PRG',
					location: {
						lat: 50.1008333,
						lng: 14.26
					}
				} as Airport,
				destination: {
					name: 'Boryspil International',
					cityName: 'Kiev',
					iata: 'KBP',
					location: {
						lat: 50.345,
						lng: 30.8947222
					}
				} as Airport,
				flightNo: 808,
				airline: {
					id: 'PS',
					name: 'Ukraine International Airlines',
					logo: 'https://images.kiwi.com/airlines/64/PS.png'
				},
				polyline: '_yupH_q_wA{rfAwbhaB',
				arrivalTime: new Date('2017-11-22T18:30:00.000Z'),
				departureTime: new Date('2017-11-22T15:20:00.000Z'),
				stopOver: null
			} as Route,
			{
				origin: {
					name: 'Boryspil International',
					cityName: 'Kiev',
					iata: 'KBP',
					location: {
						lat: 50.345,
						lng: 30.8947222
					}
				},
				destination: {
					name: 'Dubai International',
					cityName: 'Dubai',
					iata: 'DXB',
					location: {
						lat: 25.2527778,
						lng: 55.3644444
					}
				},
				flightNo: 373,
				airline: {
					id: 'PS',
					name: 'Ukraine International Airlines',
					logo: 'https://images.kiwi.com/airlines/64/PS.png'
				},
				polyline: '{l}rHwthyD~hyyCmyiuC',
				arrivalTime: new Date('2017-11-23T02:35:00.000Z'),
				departureTime: new Date('2017-11-22T19:25:00.000Z'),
				stopOver: 3300
			} as Route
		]
	},
	inbound: {
		origin: {
			name: 'Dubai International',
			cityName: 'Dubai',
			iata: 'DXB',
			location: {
				lat: 25.2527778,
				lng: 55.3644444
			}
		} as Airport,
		destination: {
			name: 'Václav Havel Airport Prague',
			cityName: 'Prague',
			iata: 'PRG',
			location: {
				lat: 50.1008333,
				lng: 14.26
			}
		} as Airport,
		duration: 48300,
		routes: [
			{
				origin: {
					name: 'Dubai International',
					cityName: 'Dubai',
					iata: 'DXB',
					location: {
						lat: 25.2527778,
						lng: 55.3644444
					}
				},
				destination: {
					name: 'Boryspil International',
					cityName: 'Kiev',
					iata: 'KBP',
					location: {
						lat: 50.345,
						lng: 30.8947222
					}
				},
				flightNo: 374,
				airline: {
					id: 'PS',
					name: 'Ukraine International Airlines',
					logo: 'https://images.kiwi.com/airlines/64/PS.png'
				},
				polyline: '{bcxCeosoI_iyyClyiuC',
				arrivalTime: new Date('2017-11-25T08:05:00.000Z'),
				departureTime: new Date('2017-11-25T04:05:00.000Z'),
				stopOver: null
			} as Route,
			{
				origin: {
					name: 'Boryspil International',
					cityName: 'Kiev',
					iata: 'KBP',
					location: {
						lat: 50.345,
						lng: 30.8947222
					}
				},
				destination: {
					name: 'Václav Havel Airport Prague',
					cityName: 'Prague',
					iata: 'PRG',
					location: {
						lat: 50.1008333,
						lng: 14.26
					}
				},
				flightNo: 807,
				airline: {
					id: 'PS',
					name: 'Ukraine International Airlines',
					logo: 'https://images.kiwi.com/airlines/64/PS.png'
				},
				polyline: '{l}rHwthyDzrfAvbhaB',
				arrivalTime: new Date('2017-11-25T14:30:00.000Z'),
				departureTime: new Date('2017-11-25T13:20:00.000Z'),
				stopOver: 18900
			} as Route
		]
	}
} as FlightSearchResult;
