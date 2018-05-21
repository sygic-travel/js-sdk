import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import { assert, sandbox as sinonSandbox, SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';

import { AuthResponse, RegistrationResponseCode, ResetPasswordResponseCode, Session, UserInfo, UserSettings } from '.';
import { ApiResponse, SsoApi, StApi } from '../Api';
import { sessionCache, userCache } from '../Cache';
import { setEnvironment } from '../Settings';
import { tokenData } from '../TestData/SsoApiResponses';
import { userInfo as userInfoApiResponse } from '../TestData/UserInfoApiResponse';
import { session as testSession, userInfo as userInfoResult } from '../TestData/UserInfoExpectedResults';
import { cloneDeep } from '../Util';
import * as Dao from './DataAccess';
import { PrivacyConsentPayload, PrivacyConsentsFlow, PrivacyConsentsType, ThirdPartyAuthType } from './User';

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('UserDataAccess', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321', ssoClientId: 'sso_client_id' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
		clock = sandbox.useFakeTimers(10000000);
	});

	afterEach(() => {
		sandbox.restore();
		userCache.reset();
		sessionCache.reset();
		clock.restore();
	});

	const settingsApiData = {
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
			const stub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, settingsApiData));
			}));

			return Dao.getUserSettings().then((result) => {
				assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(settings);
			});
		});

		it('should get user settings response from cache if it is already in cache', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, settingsApiData));
			}));

			await userCache.set('settings', settingsApiData.settings);

			return Dao.getUserSettings().then((result) => {
				assert.notCalled(apiStub);
				return chai.expect(result).to.deep.equal(settings);
			});

		});
	});

	describe('#updateUserSettings', () => {
		it('should put updated settings in cache and call api', () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, settingsApiData));
			}));
			return Dao.updateUserSettings(settings).then(() => {
				chai.expect(userCache.get('settings'))
					.to.be.eventually.deep.equal(settingsApiData.settings);
				return chai.expect(apiStub.callCount).to.equal(1);
			});
		});
	});

	describe('#getSessionWithDeviceId', () => {
		it('should get the token from api', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithDeviceId('id', 'platform').then((data) => {
				chai.expect(data).to.deep.equal({code: 'OK', session: testSession});
				chai.expect(apiStub.callCount).to.equal(1);
				chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.equal('id');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.equal('platform');
				chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('client_credentials');
			});
		});
	});

	describe('#getSessionWithPassword', () => {
		it('should get the token from api', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithPassword('name', 'pass').then((data) => {
				chai.expect(data).to.deep.equal({code: 'OK', session: testSession});
				chai.expect(apiStub.callCount).to.equal(1);
				chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
				chai.expect(apiStub.getCall(0).args[1]['username']).to.equal('name');
				chai.expect(apiStub.getCall(0).args[1]['password']).to.equal('pass');
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.be.undefined('Expect undefined');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.be.undefined('Expect undefined');
				chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('password');
			});
		});

		it('should call the api with optional parameters', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithPassword('name', 'pass', 'id', 'ios').then((data) => {
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.equal('id');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.equal('ios');
			});
		});

		it('should handle the invalid credentials auth error', async () => {
			sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(401, tokenData));
			}));
			const result: AuthResponse = await Dao.getSessionWithPassword('name', 'pass', 'id', 'ios');
			chai.expect(result.session).to.be.null('Expect null');
			chai.expect(result.code).to.equal('ERROR_INVALID_CREDENTIALS');
		});

		it('should handle the other errors', async () => {
			sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(500, tokenData));
			}));
			const result: AuthResponse = await Dao.getSessionWithPassword('name', 'pass', 'id', 'ios');
			chai.expect(result.session).to.be.null('Expect null');
			chai.expect(result.code).to.equal('ERROR');
		});
	});

	describe('#getSessionWithJwt', () => {
		it('should get the token from api', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithJwt('asdfg.xxx.asdfg').then((data) => {
				chai.expect(data).to.deep.equal({code: 'OK', session: testSession});
				chai.expect(apiStub.callCount).to.equal(1);
				chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
				chai.expect(apiStub.getCall(0).args[1]['token']).to.equal('asdfg.xxx.asdfg');
				chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('external');
			});
		});

		it('should call the api with optional parameters', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithJwt('asdfg.xxx.asdfg', 'deviceId', 'devicePlatform').then((data) => {
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.equal('deviceId');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.equal('devicePlatform');
			});
		});
	});

	describe('#getSessionWithThirdPartyAuth', () => {
		it('should get the token from api by access token', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithThirdPartyAuth(ThirdPartyAuthType.facebook, 'facebook_token').then((data) => {
				chai.expect(data).to.deep.equal({code: 'OK', session: testSession});
				chai.expect(apiStub.callCount).to.equal(1);
				chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
				chai.expect(apiStub.getCall(0).args[1]['access_token']).to.equal('facebook_token');
				chai.expect(apiStub.getCall(0).args[1]['authorization_code']).to.be.undefined('Expect undefined');
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.be.undefined('Expect undefined');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.be.undefined('Expect undefined');
				chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('facebook');
			});
		});

		it('should call the api with optional parameters', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));
			return Dao.getSessionWithThirdPartyAuth(
				ThirdPartyAuthType.facebook,
				'token',
				'id',
				'platform'
			).then((data) => {
				chai.expect(apiStub.getCall(0).args[1]['device_code']).to.equal('id');
				chai.expect(apiStub.getCall(0).args[1]['device_platform']).to.equal('platform');
			});
		});
	});

	describe('#getSessionWithRefreshToken', () => {
		it('should get the token from api', () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, tokenData));
			}));

			return Dao.getSessionWithRefreshToken('abcd').then((data) => {
				chai.expect(data).to.deep.equal({code: 'OK', session: testSession});
				chai.expect(apiStub.callCount).to.equal(1);
				chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
				chai.expect(apiStub.getCall(0).args[1]['refresh_token']).to.equal('abcd');
				chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('refresh_token');
			});
		});

	});

	const regRequest = {
		username: 'email@example.com',
		email_is_verified: false,
		email: 'email@example.com',
		password: '12345678',
		name: 'name'
	};

	describe('#register', () => {
		it('should call api properly', async () => {
			const response = {id: '132456'};
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');

			apiStub.withArgs('oauth2/token', {grant_type: 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));

			apiStub.withArgs('user/register', regRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, response));
				}));

			await Dao.registerUser(regRequest.email, regRequest.password, regRequest.name);
			chai.expect(apiStub.callCount).to.equal(2);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
			chai.expect(apiStub.getCall(0).args[1]['grant_type']).to.equal('client_credentials');
			chai.expect(apiStub.getCall(1).args[1]['username']).to.equal('email@example.com');
			chai.expect(apiStub.getCall(1).args[1]['email']).to.equal('email@example.com');
			chai.expect(apiStub.getCall(1).args[1]['password']).to.equal('12345678');
			chai.expect(apiStub.getCall(1).args[1]['name']).to.equal('name');
			chai.expect(apiStub.getCall(1).args[1]['email_is_verified']).to.be.false('Expect false');
		});

		it('should handle the already registered error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/register', regRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(409, {type: ''}));
				}));
			const result: RegistrationResponseCode =
				await Dao.registerUser(regRequest.email, regRequest.password, regRequest.name);
			chai.expect(result).to.equal('ERROR_ALREADY_REGISTERED');
		});

		it('should handle minimal password error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/register', regRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(422, {type: 'validation.password.min_length'}));
				}));
			const result: RegistrationResponseCode =
				await Dao.registerUser(regRequest.email, regRequest.password, regRequest.name);
			chai.expect(result).to.equal('ERROR_PASSWORD_MIN_LENGTH');
		});

		it('should handle minimal password error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/register', regRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(422, {type: 'validation.email.invalid_format'}));
				}));
			const result: RegistrationResponseCode =
				await Dao.registerUser(regRequest.email, regRequest.password, regRequest.name);
			chai.expect(result).to.equal('ERROR_EMAIL_INVALID_FORMAT');
		});

		it('should handle the other errors', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/register', regRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(500, {type: ''}));
				}));
			const result: RegistrationResponseCode =
				await Dao.registerUser(regRequest.email, regRequest.password, regRequest.name);
			chai.expect(result).to.equal('ERROR');
		});
	});

	describe('#reset password', () => {
		const resetPasswordRequest = {
			email: 'email@example.com'
		};
		it('should call api properly', async () => {
			const response = {};
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');

			apiStub.withArgs('oauth2/token', {grant_type: 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));

			apiStub.withArgs('user/reset-password', resetPasswordRequest , testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, response));
				}));

			await Dao.resetPassword('email@example.com');
			chai.expect(apiStub.callCount).to.equal(2);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('oauth2/token');
			chai.expect(apiStub.getCall(1).args[1]['email']).to.equal('email@example.com');
		});

		it('should handle invalid email error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/reset-password', resetPasswordRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(422, {type: ''}));
				}));
			const result: ResetPasswordResponseCode =
				await Dao.resetPassword('email@example.com');
			chai.expect(result).to.equal('ERROR_EMAIL_INVALID_FORMAT');
		});

		it('should handle email not found error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/reset-password', resetPasswordRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(404, {type: ''}));
				}));
			const result: ResetPasswordResponseCode =
				await Dao.resetPassword('email@example.com');
			chai.expect(result).to.equal('ERROR_USER_NOT_FOUND');
		});

		it('should handle other error', async () => {
			const apiStub: SinonStub = sandbox.stub(SsoApi, 'post');
			apiStub.withArgs('oauth2/token', { grant_type : 'client_credentials'})
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tokenData));
				}));
			apiStub.withArgs('user/reset-password', resetPasswordRequest, testSession)
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(403, {type: ''}));
				}));
			const result: ResetPasswordResponseCode =
				await Dao.resetPassword('email@example.com');
			chai.expect(result).to.equal('ERROR');
		});
	});

	describe('#getUserInfo', () => {
		it('should call api and handle result for active session', async () => {
			await Dao.setUserSession(testSession);
			sandbox.stub(StApi, 'get').withArgs('user/info')
				.returns(new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, userInfoApiResponse));
				}));
			const userInfo: UserInfo | null = await Dao.getUserInfo();
			chai.expect(userInfo).deep.equal(userInfoResult);
		});
	});

	describe('#requestCancelAccount', () => {
		it('should call call api properly', async () => {
			await Dao.setUserSession(testSession);
			const apiStub: SinonStub = sandbox.stub(StApi, 'post').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {}));
				}));
			await Dao.requestCancelAccount();
			chai.expect(apiStub.callCount).to.equal(1);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('user/cancel-account');
		});
	});

	describe('#deleteAccount', () => {
		it('should call call api properly', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'delete_').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {}));
				}));
			await Dao.deleteAccount('xxx', '12345');
			chai.expect(apiStub.callCount).to.equal(1);
			chai.expect(apiStub.getCall(0).args[0]).to.equal('users');
			chai.expect(apiStub.getCall(0).args[1]['id']).to.equal('xxx');
			chai.expect(apiStub.getCall(0).args[1]['hash']).to.equal('12345');
		});
	});

	describe('#getUserSession', () => {
		it('should should call refresh token when session is near expiration', async () => {
			await sessionCache.set('user_session', testSession);
			const refreshedSession: Session = cloneDeep(testSession);
			refreshedSession.suggestedRefreshTimestamp = 12500000;
			refreshedSession.expirationTimestamp = 13000000;
			const stub: SinonStub = sandbox.stub(SsoApi, 'post').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						access_token: refreshedSession.accessToken,
						refresh_token: refreshedSession.refreshToken,
						expires_in: 1000,
					}));
				}));
			clock.tick(2000000);
			const session: Session | null = await Dao.getUserSession();
			chai.expect(session).deep.equal(refreshedSession);
			chai.expect(stub.callCount).equal(1);

		});

		it('should should not call refresh token when session is fresh', async () => {
			await sessionCache.set('user_session', testSession);
			const stub: SinonStub = sandbox.stub(SsoApi, 'post');
			clock.tick(1000000);
			const session: Session | null = await Dao.getUserSession();
			chai.expect(session).deep.equal(testSession);
			chai.expect(stub.callCount).equal(0);
		});

		it('should should not call refresh token when session is incomplete', async () => {
			const incompleteSession = cloneDeep(testSession);
			incompleteSession.refreshToken = '';
			await sessionCache.set('user_session', incompleteSession);
			const stub: SinonStub = sandbox.stub(SsoApi, 'post');
			clock.tick(3000000);
			const session: Session | null = await Dao.getUserSession();
			chai.expect(session).deep.equal(incompleteSession);
			chai.expect(stub.callCount).equal(0);
		});
	});

	describe('#setPrivacyConsent', () => {
		it('should call api with correct parameters', async () => {
			const apiStub: SinonStub = sandbox.stub(StApi, 'post');

			await Dao.setPrivacyConsent({
				type: PrivacyConsentsType.MARKETING,
				flow: PrivacyConsentsFlow.SIGN_IN,
				consentText: 'test',
				agreed: true
			} as PrivacyConsentPayload);

			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				agreed: true,
				consent_text: 'test',
				flow: 'sign_in',
				type: 'marketing'
			});
		});
	});
});
