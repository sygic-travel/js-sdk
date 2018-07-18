import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { Location } from '../Geo';
import { setEnvironment } from '../Settings';
import { route } from '../TestData/DirectionsApiResponses';
import { TransportAvoid, TransportMode } from '../Trip';
import { cloneDeep } from '../Util';
import * as dao from './DataAccess';
import { DirectionSendResponseCode, Route, RouteRequest } from './Route';

import { routesCache } from '../Cache';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('RouteDataAccess', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		routesCache.reset();
		sandbox.restore();
	});

	describe('#getRoutes', () => {
		it('should correctly combine cached and api results with plane', async () => {
			const routesData = [
				Object.assign(cloneDeep(route), { origin: {lat: 1, lng: 1}}),
				Object.assign(cloneDeep(route), { origin: {lat: 2, lng: 2}}),
				Object.assign(cloneDeep(route), { origin: {lat: 3, lng: 3}}),
				Object.assign(cloneDeep(route), { origin: {lat: 4, lng: 4}}),
			];

			const buildRequest = (data: any): RouteRequest => ({
				origin: data.origin as Location,
				destination: data.destination,
				waypoints: [],
				avoid: [],
				chosenMode: TransportMode.CAR,
				departAt: null,
				arriveAt: null
			});

			const requests = routesData.map(buildRequest);
			const cacheMap = new Map<string, any>();
			cacheMap.set('1-1-49.2080844-16.582545--', routesData[0]);
			cacheMap.set('2-2-49.2080844-16.582545--', null);
			cacheMap.set('3-3-49.2080844-16.582545--', routesData[2]);
			cacheMap.set('4-4-49.2080844-16.582545--', null);

			sandbox.stub(routesCache, 'getBatchMap').returns(new Promise((resolve) => (resolve(cacheMap))));

			sandbox.stub(StApi, 'post').returns(
				new Promise((resolve) => (resolve({data: { path: [routesData[1], routesData[3]]}})))
			);

			const routes: Route[] = await dao.getRoutes(requests);
			chai.expect(routes.length).to.equal(4);
			chai.expect(routes[0].origin.lat).to.equal(1);
			chai.expect(routes[1].origin.lat).to.equal(2);
			chai.expect(routes[2].origin.lat).to.equal(3);
			chai.expect(routes[3].origin.lat).to.equal(4);
			chai.expect(routes[0].modeDirections.length).to.equal(8);
			chai.expect(routes[1].modeDirections.length).to.equal(8);
			chai.expect(routes[2].modeDirections.length).to.equal(8);
			chai.expect(routes[3].modeDirections.length).to.equal(8);
		});
	});

	describe('#sendDirections', () => {
		it('should send correct request', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'post').returns(
				new Promise((resolve) => resolve(new ApiResponse(200, null)))
			);

			const result: DirectionSendResponseCode = await dao.sendDirections('email@example.com', {
				name: 'Some name',
				location: {
					lat: 1,
					lng: 2
				}
			});
			chai.expect(result).to.equal(DirectionSendResponseCode.OK);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('directions/send-by-email');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				user_email: 'email@example.com',
				destination: {
					name: 'Some name',
					location: {
						lat: 1,
						lng: 2
					}
				}
			});
		});

		it('should send correct request with origin, waypoints and avoids', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'post').returns(
				new Promise((resolve) => resolve(new ApiResponse(200, null)))
			);

			const result: DirectionSendResponseCode = await dao.sendDirections(
				'email@example.com', {
				name: 'destination',
				location: {
					lat: 1,
					lng: 2
				}
			}, {
				name: 'origin',
				location: {
					lat: 3,
					lng: 4
				}
			}, [{
				placeId: '12345',
				location: {
					lat: 5,
					lng: 6
				}
			}], [
				TransportAvoid.UNPAVED,
				TransportAvoid.FERRIES
			]);
			chai.expect(result).to.equal(DirectionSendResponseCode.OK);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('directions/send-by-email');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				user_email: 'email@example.com',
				destination: {
					name: 'destination',
					location: {
						lat: 1,
						lng: 2
					}
				},
				origin: {
					name: 'origin',
					location: {
						lat: 3,
						lng: 4
					}
				},
				waypoints: [{
					place_id: '12345',
					location: {
						lat: 5,
						lng: 6
					}
				}],
				avoid: [
					'unpaved',
					'ferries'
				]
			});
		});

		it('should return correctly map chosen route', async () => {
			sandbox.stub(StApi, 'post').returns(
				new Promise((resolve) => resolve(new ApiResponse(200, {
					path: [route]
				})))
			);
			const routes: Route[] = await dao.getRoutes([{
				origin: {
					lat: 1,
					lng: 2
				},
				destination: {
					lat: 3,
					lng: 4
				},
				avoid: [],
				chosenMode: null,
				departAt: null,
				arriveAt: null
			}]);

			chai.expect(routes[0].chosenDirection.distance).to.eq(530);
			chai.expect(routes[0].chosenDirection.duration).to.eq(300);
			chai.expect(routes[0].chosenDirection.routeId).to.eq(null);
			chai.expect(routes[0].chosenDirection.mode).to.eq('pedestrian');
		});
	});
});
