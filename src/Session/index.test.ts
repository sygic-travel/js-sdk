import * as chai from 'chai';
import { sandbox as sinonSandbox, SinonFakeTimers, SinonSandbox, SinonSpyCall, SinonStub } from 'sinon';
import { getSession, getUserInfo, Session, setSession, unsubscribeEmail} from '.';
import { ApiResponse, StApi } from '../Api';
import { cloneDeep } from '../Util';
import * as Dao from './DataAccess';

import { session as testSession } from '../TestData/UserInfoExpectedResults';
import { AuthenticationResponseCode, AuthResponse } from './Session';

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

describe('UserController', () => {

	describe('#getUserInfo', () => {
		it('should throw an exception when no user session is set', async () => {
			await setSession(null);
			getUserInfo().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});

	describe('#getSession', () => {
		beforeEach(async () => {
			await setSession(testSession);
			sandbox = sinonSandbox.create();
			clock = sandbox.useFakeTimers(10000000);
		});

		afterEach(async () => {
			sandbox.restore();
			clock.restore();
		});

		it('should should call refresh token when session is near expiration', async () => {
			const refreshedSession: Session = cloneDeep(testSession);
			refreshedSession.suggestedRefreshTimestamp += 2000000;
			refreshedSession.expirationTimestamp += 2000000;
			const stub: SinonStub = sandbox.stub(Dao, 'getSessionWithRefreshToken').returns(
				new Promise<AuthResponse>((resolve) => {
				resolve({
					code: AuthenticationResponseCode.OK,
					session: refreshedSession
				});
			}));
			clock.tick(2000000);
			const session: Session | null = await getSession();
			chai.expect(session).deep.equal(refreshedSession);
			chai.expect(stub.callCount).equal(1);

		});

		it('should should not call refresh token when session is fresh', async () => {
			const stub: SinonStub = sandbox.stub(Dao, 'getSessionWithRefreshToken');
			clock.tick(1000000);
			const session: Session | null = await getSession();
			chai.expect(session).deep.equal(testSession);
			chai.expect(stub.callCount).equal(0);
		});

		it('should should not call refresh token when session is incomplete', async () => {
			const incompleteSession = cloneDeep(testSession);
			incompleteSession.refreshToken = '';
			await setSession(incompleteSession);
			const stub: SinonStub = sandbox.stub(Dao, 'getSessionWithRefreshToken');
			clock.tick(3000000);
			const session: Session | null = await getSession();
			chai.expect(session).deep.equal(incompleteSession);
			chai.expect(stub.callCount).equal(0);
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
			chai.expect(call.args[1]).to.be.null;
		});

		it('should throw error when calling api without session set and without hash parameter', async () => {
			await setSession(null);
			unsubscribeEmail().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});
});
