import * as chai from 'chai';
import { sandbox as sinonSandbox, SinonSandbox, SinonSpyCall, SinonStub } from 'sinon';
import { getUserInfo, setSession, unsubscribeEmail} from '.';
import { ApiResponse, StApi } from '../Api';

import { session as testSession } from '../TestData/UserInfoExpectedResults';

let sandbox: SinonSandbox;

describe('UserController', () => {

	describe('#getUserInfo', () => {
		it('should throw an exception when no user session is set', async () => {
			await setSession(null);
			getUserInfo().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});

	describe('#unsubscribeEmail', () => {
		beforeEach(async () => {
			sandbox = sinonSandbox.create();
		});

		afterEach(async () => {
			sandbox.restore();
		});

		it('should call api with hash parameter when provided', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'delete_').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {}));
				}));
			await unsubscribeEmail('abcdefgh');
			const call: SinonSpyCall = apiStub.getCall(0);
			chai.expect(call.args).to.have.length(2);
			chai.expect(call.args[1]).to.deep.eq({
				hash: 'abcdefgh'
			});
		});

		it('should call api with session set and without hash parameter', async () => {
			await setSession(testSession);
			const apiStub: SinonStub = sandbox.stub(StApi, 'delete_').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {}));
				}));
			await unsubscribeEmail();
			const call: SinonSpyCall = apiStub.getCall(0);
			chai.expect(call.args).to.have.length(2);
			chai.expect(call.args[1]).to.equal(null);
		});

		it('should throw error when calling api without session set and without hash parameter', async () => {
			await setSession(null);
			unsubscribeEmail().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});
});
