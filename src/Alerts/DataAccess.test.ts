import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';
import { ApiResponse, StApi } from '../Api';
import { cloneDeep } from '../Util';
import { Alert, DetailedAlert, Severity, Type } from './Alert';

import {
	alerts as alertsListApiResponse,
	detailedAlert as detailedAlertApiResponse
} from '../TestData/AlertsApiResponses';
import {
	alerts as alertsListExpectedResult,
	detailedAlert as detailedAlertExpectedResult
} from '../TestData/AlertsExpectedResults';
import { AlertsQuery } from './AlertsQuery';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('AlertsDataAccess', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getAlerts', () => {
		it('should call api with correct arguments and correctly map response', async () => {
			const stub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(alertsListApiResponse)));
			}));

			await Dao.getAlerts({
				from: '2018-01-10',
				to: '2018-01-20',
			} as AlertsQuery);

			chai.expect(stub.getCall(0).args[0]).to.deep.equal('alerts/list?from=2018-01-10&limit=100&to=2018-01-20');

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
			chai.expect(stub.getCall(1).args[0]).to.deep.equal(queryString);
			chai.expect(alertsFromDao).to.deep.equal(alertsListExpectedResult);
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
