import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';
import { RouteRequest } from '.';
import { StApi } from '../Api';
import { Location } from '../Geo';
import { setEnvironment } from '../Settings';
import { route } from '../TestData/DirectionsApiResponses';
import { TransportMode } from '../Trip';
import * as dao from './DataAccess';
import { Route } from './Route';

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
				chosenMode: TransportMode.car,
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
			chai.expect(routes[0].modeDirections.length).to.equal(7);
			chai.expect(routes[1].modeDirections.length).to.equal(7);
			chai.expect(routes[2].modeDirections.length).to.equal(7);
			chai.expect(routes[3].modeDirections.length).to.equal(7);
		});
	});
});
