import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import * as ForecastController from '.';
import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import * as TestApiResponses from '../TestData/ForecastApiResponses';
import * as TestExpectedResults from '../TestData/ForecastExpectedResults';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('ForecastDataAccess', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getDestinationWeather', () => {
		it('should throw and exception when response without forecast came', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			return chai.expect(ForecastController.getDestinationWeather('123')).to.be.rejected('Should be rejected');
		});

		it('should correctly map api respose', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestApiResponses.forecasts));
			}));

			return chai.expect(ForecastController.getDestinationWeather('123'))
				.to.eventually.deep.equal(TestExpectedResults.forecasts);
		});
	});
});
