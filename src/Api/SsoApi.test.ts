import { AxiosRequestConfig } from 'axios';
import { assert, sandbox as sinonSandbox, SinonSandbox } from 'sinon';
import { setEnvironment } from '../Settings';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';
import { SsoApi } from './index';
import { get, post } from './SsoApi';

const testApiURL = 'https://test.api/';
const ssoClient = 'sso_client';
const testSession = getFreshSession();

let sandbox: SinonSandbox;

describe('SsoApi', () => {
	before((done) => {
		setEnvironment({
			ssoClientId: ssoClient,
			ssoApiUrl: testApiURL
		});
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#get', () => {
		it('should be called with correct base Url', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const apiStub = sandbox.stub(SsoApi.axiosInstance, 'get')
				.returns(stubResponse);

			get('test')
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, 'test', requestConfig);
				}).then(done, done);
		});
	});

	describe('#post', () => {
		it('should be called with correct base Url', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const apiStub = sandbox.stub(SsoApi.axiosInstance, 'post')
				.returns(stubResponse);

			post('/', null)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', null, requestConfig);
				}).then(done, done);
		});

		it('should add client id to data if missing', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const apiStub = sandbox.stub(SsoApi.axiosInstance, 'post')
				.returns(stubResponse);

			post('/', {})
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', { client_id: ssoClient }, requestConfig);
				}).then(done, done);
		});

		it('should not touch client id to data if present', (done) => {
			const clientId = 'test_id';
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'Content-Type': 'application/json'
				}
			};
			const apiStub = sandbox.stub(SsoApi.axiosInstance, 'post')
				.returns(stubResponse);

			post('/', { client_id: clientId })
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', { client_id: clientId }, requestConfig);
				}).then(done, done);
		});

		it('should add Authorization header if session is passed', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'Content-Type': 'application/json',
					'Authorization' : `Bearer ${testSession.accessToken}`
				}
			};
			const apiStub = sandbox.stub(SsoApi.axiosInstance, 'post')
				.returns(stubResponse);

			post('/', null , testSession)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', null, requestConfig);
				}).then(done, done);
		});
	});

});
