import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';
import { sandbox as sinonSandbox, SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';
import { getUserInfo, getUserSession, Session, setUserSession } from '.';
import * as Dao from './DataAccess';

import { session as testSession } from '../TestData/UserInfoExpectedResults';
import { AuthResponse } from './Session';

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

describe('UserController', () => {

	describe('#getUserInfo', () => {
		it('should throw an exception when no user session is set', async () => {
			await setUserSession(null);
			getUserInfo().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});

	describe('#getUserSession', () => {
		beforeEach(async () => {
			await setUserSession(testSession);
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
					code: 'OK',
					session: refreshedSession
				});
			}));
			clock.tick(2000000);
			const session: Session | null = await getUserSession();
			chai.expect(session).deep.equal(refreshedSession);
			chai.expect(stub.callCount).equal(1);

		});

		it('should should not call refresh token when session is fresh', async () => {
			const stub: SinonStub = sandbox.stub(Dao, 'getSessionWithRefreshToken');
			clock.tick(1000000);
			const session: Session | null = await getUserSession();
			chai.expect(session).deep.equal(testSession);
			chai.expect(stub.callCount).equal(0);
		});

		it('should should not call refresh token when session is incomplete', async () => {
			const incompleteSession = cloneDeep(testSession);
			incompleteSession.refreshToken = null;
			await setUserSession(incompleteSession);
			const stub: SinonStub = sandbox.stub(Dao, 'getSessionWithRefreshToken');
			clock.tick(3000000);
			const session: Session | null = await getUserSession();
			chai.expect(session).deep.equal(incompleteSession);
			chai.expect(stub.callCount).equal(0);
		});
	});
});
