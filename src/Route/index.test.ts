import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';

import * as RoutesController from '.';
import { Route, TripDayRoutes } from '.';
import { Dao as placesDao, Place } from '../Places';
import { route } from '../TestData/DirectionsEntities';
import { tripDetailed } from '../TestData/TripExpectedResults';
import { Dao as tripDao, TransportSettings, Trip } from '../Trip';
import * as routesDao from './DataAccess';

let sandbox: SinonSandbox;

describe('RoutesController', () => {

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getRoutesForTripDay', () => {
		it('should build explicit flags correctly', async () => {
			const trip = cloneDeep(tripDetailed);
			const transportFromPrevious: TransportSettings = {
				duration: null,
				startTime: null,
				mode: 'pedestrian',
				routeId: null,
				avoid: [],
				note: null,
				waypoints: [],
			};
			trip.days[0].itinerary[1].transportFromPrevious = transportFromPrevious;
			trip.days[0].itinerary.push(cloneDeep(trip.days[0].itinerary[0]));
			sandbox.stub(tripDao, 'getTripDetailed').returns(new Promise<Trip>((resolve) => {resolve(trip); }));
			sandbox.stub(placesDao, 'getPlacesFromTripDay').returns(new Promise<Place[]>((resolve) => {resolve([
				trip.days[0].itinerary[0].place,
				trip.days[0].itinerary[1].place,
				trip.days[0].itinerary[2].place
			]); }));
			sandbox.stub(routesDao, 'getRoutes').returns(new Promise<Route[]>((resolve) => {resolve([
					cloneDeep(route),
					cloneDeep(route),
			]); }));
			const dayRoutes: TripDayRoutes = await RoutesController.getRoutesForTripDay('12345', 0);
			chai.expect(dayRoutes.routes.length).to.equal(2);
			chai.expect(dayRoutes.userTransportSettings).to.deep.equal([transportFromPrevious, null]);
		});
	});
});