import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { UserSettings } from '.';
import { userCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('UserDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
		userCache.reset();
	});

	const apiData = {
		settings: {
			home_place_id: 'poi:1',
			work_place_id: 'poi:2'
		}
	};

	const settings: UserSettings = {
		homePlaceId: 'poi:1',
		workPlaceId: 'poi:2'
	};

	describe('#getUserSettings', () => {
		it('should get user settings from api if is not in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiData));
			}));

			return Dao.getUserSettings().then((result) => {
				sinon.assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(settings);
			});
		});

		it('should get user settings response from cache if it is already in cache', async () => {
			const apiStub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiData));
			}));

			await userCache.set('settings', apiData.settings);

			return Dao.getUserSettings().then((result) => {
				sinon.assert.notCalled(apiStub);
				return chai.expect(result).to.deep.equal(settings);
			});

		});
	});

	describe('#updateUserSettings', () => {
		it('should put updated settings in cache and call api', () => {
			const apiStub: SinonStub = sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiData));
			}));
			return Dao.updateUserSettings(settings).then(() => {
				chai.expect(userCache.get('settings'))
					.to.be.eventually.deep.equal(apiData.settings);
				return chai.expect(apiStub.callCount).to.equal(1);
			});
		});
	});
});
