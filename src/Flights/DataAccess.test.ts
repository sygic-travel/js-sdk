import * as chai from 'chai';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';
import { FlightSearchResult, FlightsQuery } from '.';
import { ApiResponse, KiwiApi } from '../Api';
import { airlines, airports, flights } from '../TestData/FlightsApiResponses';
import { result } from '../TestData/FlightsExpectedResults';
import * as dao from './DataAccess';

let sandbox: SinonSandbox;

describe('RouteDataAccess', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getFlights', () => {
		it('should correctly combine call apis and map response', async () => {
			const kiwiApiStub: SinonStub = sandbox.stub(KiwiApi, 'get');

			kiwiApiStub.withArgs(
				'https://api.skypicker.com/flights?partner=sygictravel&' +
				'flyFrom=49.22-16.57-250km&to=25.25-55.36-250km&dateFrom=22%2F11%2F2017&dateTo=22%2F11%2F2017&' +
				'curr=USD&locale=en&adults=&maxstopovers=1&returnFrom=25%2F11%2F2017&returnTo=25%2F11%2F2017'
			).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, flights));
			}));

			kiwiApiStub.withArgs(
				'https://api.skypicker.com/airlines'
			).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, airlines));
			}));

			kiwiApiStub.withArgs(
				'https://locations.skypicker.com?type=id&id=PRG&locale=en-US'
			).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, airports.prg));
			}));

			kiwiApiStub.withArgs(
				'https://locations.skypicker.com?type=id&id=DXB&locale=en-US'
			).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, airports.dxb));
			}));

			kiwiApiStub.withArgs(
				'https://locations.skypicker.com?type=id&id=KBP&locale=en-US'
			).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, airports.kbp));
			}));

			const flightsResults: FlightSearchResult[] = await dao.getFlights({
				origin: {
					lat: 49.215259,
					lng: 16.571589
				},
				destination: {
					lat: 25.252253,
					lng:  55.364348
				},
				date: '2017-11-22',
				returnDate: '2017-11-25'
			} as FlightsQuery);

			chai.expect(kiwiApiStub.callCount).to.equal(5);
			chai.expect(flightsResults).deep.equal([result]);
		});
	});
});
