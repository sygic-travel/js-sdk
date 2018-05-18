import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import { ApiResponse, StApi } from '../Api';
import { alertsCache } from '../Cache';
import * as BoundsModule from '../Geo/Bounds';
import {
	alerts as alertsListApiResponse,
	detailedAlert as detailedAlertApiResponse
} from '../TestData/AlertsApiResponses';
import {
	alerts as alertsListExpectedResult,
	detailedAlert as detailedAlertExpectedResult
} from '../TestData/AlertsExpectedResults';
import { cloneDeep } from '../Util';
import { Alert, DetailedAlert, Severity, Type } from './Alert';
import { AlertsQuery } from './AlertsQuery';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('AlertsDataAccess', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
		alertsCache.reset();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getAlerts', () => {
		it('should call api with correct arguments and correctly map response when calling without bounds', async () => {
			const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));
			const cacheStub: SinonSpy = sandbox.stub(alertsCache, 'get');

			await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
			} as AlertsQuery);

			chai.expect(stApistub.getCall(0).args[0]).to.deep.equal('alerts/list?from=2018-01-10&limit=100&to=2018-01-20');

			const alertsFromDao: Alert[] = await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
				limit: 10,
				types: [Type.FLOOD, Type.SNOW],
				severities: [Severity.MODERATE, Severity.EXTREME],
				placeIds: ['country:10', 'country:20']
			} as AlertsQuery);
			const queryString: string = `alerts/list?from=2018-01-10&limit=10&\
place_ids=country%3A10%7Ccountry%3A20&severity=moderate%7Cextreme&to=2018-01-20&type=flood%7Csnow`;
			chai.expect(stApistub.getCall(1).args[0]).to.deep.equal(queryString);
			chai.expect(alertsFromDao).to.deep.equal(alertsListExpectedResult);
			return chai.expect(cacheStub.notCalled).to.be.true;
		});

		it('should call api with correct arguments and correctly map response when calling with bounds and cache is empty',
			async () => {
			const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));
			const cacheStubGet: SinonStub = sandbox.stub(alertsCache, 'get');
			const cacheStubSet: SinonStub = sandbox.stub(alertsCache, 'set');

			await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
				bounds: {
					south: 10,
					west: 10,
					north: 20,
					east: 20
				}
			} as AlertsQuery);

			chai.expect(cacheStubGet.getCall(0).args[0]).to.be.eq('filterQuery');
			chai.expect(cacheStubGet.getCall(1).args[0]).to.be.eq('bounds');

			const requestQueryStringWithBounds: string =
				'alerts/list?bounds=10%2C10%2C20%2C20&from=2018-01-10&limit=100&to=2018-01-20';
			chai.expect(stApistub.getCall(0).args[0]).to.deep.equal(requestQueryStringWithBounds);

			chai.expect(cacheStubSet.getCall(0).args[0]).to.be.eq('filterQuery');
			const requestQueryStringWithoutBounds: string = 'alerts/list?from=2018-01-10&limit=100&to=2018-01-20';
			chai.expect(cacheStubSet.getCall(0).args[1]).to.be.eq(requestQueryStringWithoutBounds);
			chai.expect(cacheStubSet.getCall(1).args[0]).to.be.eq('bounds');
			chai.expect(cacheStubSet.getCall(1).args[1]).to.be.deep.eq({
				east: 21.934864398722972,
				north: 21.78536722753607,
				south: 8.199308940027162,
				west: 8.18480833851933
			});
			chai.expect(cacheStubSet.getCall(2).args[0]).to.be.eq('alerts');
			chai.expect(cacheStubSet.getCall(2).args[1]).to.be.deep.eq(cloneDeep(alertsListApiResponse.alerts));
		});

		it('should call api when calling with bounds and cached alerts are not within those bounds',
			async () => {
			alertsCache.set('bounds', {
				south: 10,
				west: 10,
				north: 20,
				east: 20
			});
			alertsCache.set('filterQuery', 'alerts/list?from=2018-01-10&limit=100&to=2018-01-20');
			alertsCache.set('alerts', []);

			const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));

			await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
				bounds: {
					south: 10,
					west: 30,
					north: 20,
					east: 40
				}
			} as AlertsQuery);

			chai.expect(stApistub.getCall(0).args[0])
				.to.deep.equal('alerts/list?bounds=10%2C30%2C20%2C40&from=2018-01-10&limit=100&to=2018-01-20');
		});

		it('should call api when calling with bounds and cached filter is not the same as call filter',
			async () => {
			alertsCache.set('bounds', {
				south: 10,
				west: 10,
				north: 20,
				east: 20
			});
			alertsCache.set('filterQuery', 'alerts/list?from=2018-01-10&limit=100&to=2018-01-20');
			alertsCache.set('alerts', []);

			const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));

			await Dao.getAlerts({
				from: '2018-02-10',
				to: '2018-02-20',
				bounds: {
					south: 11,
					west: 11,
					north: 19,
					east: 19
				}
			} as AlertsQuery);

			chai.expect(stApistub.getCall(0).args[0])
				.to.deep.equal('alerts/list?bounds=11%2C11%2C19%2C19&from=2018-02-10&limit=100&to=2018-02-20');
		});

		it('should not call api when bounds are within cached bounds and filter query is the same as cached filter query',
			async () => {
			alertsCache.set('bounds', {
				south: 47.954668255899016,
				west: 13.515801429748537,
				north: 55.2929235727232 ,
				east: 24.59002017974854
			});
			alertsCache.set('filterQuery', 'alerts/list?from=2018-01-10&limit=100&to=2018-01-20');
			alertsCache.set('alerts', cloneDeep(alertsListApiResponse.alerts));

			const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));
			sandbox.stub(BoundsModule, 'getGeoJsonAndBoundsIntersection')
				.returns(true);

			const alerts: Alert[] = await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
				bounds: {
					south: 49.90244371958209,
					west: 16.28304719924927,
					north: 53.57035171396274,
					east: 21.82015657424927
				}
			} as AlertsQuery);

			chai.expect(stApistub.called).to.be.false;
			chai.expect(alerts).to.be.deep.eq(alertsListExpectedResult);
		});

		it('should not call api when there is empty alerts cache and bounds & filter are the same',
			async () => {
				alertsCache.set('bounds', {
					south: 47.954668255899016,
					west: 13.515801429748537,
					north: 55.2929235727232 ,
					east: 24.59002017974854
				});
				alertsCache.set('filterQuery', 'alerts/list?from=2018-01-10&limit=100&to=2018-01-20');
				alertsCache.set('alerts', []);

				const stApistub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
				}));

				const alerts: Alert[] = await Dao.getAlerts({
					from: '2018-01-10',
					to: '2018-01-20',
					bounds: {
						south: 49.90244371958209,
						west: 16.28304719924927,
						north: 53.57035171396274,
						east: 21.82015657424927
					}
				} as AlertsQuery);

				chai.expect(stApistub.called).to.be.false;
				chai.expect(alerts).to.be.deep.eq([]);
			});
	});

	describe('#getDetailedAlert', () => {
		it('should correctly map response', async () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(detailedAlertApiResponse)));
			}));

			const detailedAlerts: DetailedAlert[] = await Dao.getDetailedAlerts(['12345']);
			chai.expect(detailedAlerts[0]).to.deep.equal(detailedAlertExpectedResult);
		});
	});
});
