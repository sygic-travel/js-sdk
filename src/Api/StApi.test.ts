import { AxiosRequestConfig } from 'axios';
import * as chai from 'chai';
import { assert, sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import { setSession } from '../Session';
import { setEnvironment } from '../Settings';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';
import { StApi } from './index';
import { get, post, postMultipartJsonImage, put, setInvalidSessionHandler } from './StApi';

const testSession = getFreshSession();
const testApiURL = 'https://test.api';
const testClientKey = '987654321';
const accessToken = testSession.accessToken;

let sandbox: SinonSandbox;

describe('StApi', () => {
	before((done) => {
		setEnvironment({
			stApiUrl: testApiURL,
			integratorApiKey: testClientKey
		});
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach((done) => {
		sandbox.restore();
		setSession(null).then(() => { done(); });
	});

	describe('#get', () => {
		it('should be called with correct base Url and client key', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.returns(stubResponse);

			get('/')
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', requestConfig);
				}).then(done, done);
		});

		it('should correctly set access token and call api with it', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey,
					'Authorization': `Bearer ${accessToken}`
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.returns(stubResponse);

			setSession(testSession).then(() => {
				get('/')
					.then(() => {
						assert.calledOnce(apiStub);
						assert.calledWith(apiStub, '/', requestConfig);
					}).then(done, done);
			});
		});

		it('should not set token for some special endpoints', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.returns(stubResponse);

			setSession(testSession).then(() => {
				get('/places')
					.then(() => {
						assert.calledOnce(apiStub);
						assert.calledWith(apiStub, '/places', requestConfig);
					}).then(done, done);
			});
		});

		it('should correctly call external session callback for invalid session error', (done) => {
			let callcount = 0;
			setInvalidSessionHandler(() => {
				callcount++;
			});

			const stubError = { response: { data: { error: { id: 'apikey.invalid' }}} };
			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.throws(stubError);

			get('/')
				.catch((error) => {
					assert.calledOnce(apiStub);
					chai.expect(callcount).to.equal(1);
					chai.expect(error.message).to.equal('Invalid session');
				}).then(done, done);
		});

		it('should correctly call external session callback for other error', (done) => {
			let callcount = 0;
			setInvalidSessionHandler(() => {
				callcount++;
			});

			const stubError = { status: 403, response: {} };
			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.throws(stubError);

			get('/')
				.catch(() => {
					assert.calledOnce(apiStub);
					chai.expect(callcount).to.equal(0);
				}).then(done, done);
		});

		it('should not fail on session error without session callback', (done) => {
			const stubError = { response: { data: { error: { id: 'apikey.invalid' }}} };
			const apiStub = sandbox.stub(StApi.axiosInstance, 'get')
				.throws(stubError);

			get('/')
				.catch((e) => {
					assert.calledOnce(apiStub);
					chai.expect(e.message).to.equal('Invalid session');
				}).then(done, done);
		});
	});

	describe('#post', () => {
		it('should be called with correct base Url', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'post')
				.returns(stubResponse);

			post('/', null)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', null, requestConfig);
				}).then(done, done);
		});

		it('should correctly set access token and call api with it', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey,
					'Authorization': `Bearer ${accessToken}`
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'post')
				.returns(stubResponse);

			setSession(testSession).then(() => {
				post('/', null)
					.then(() => {
						assert.calledOnce(apiStub);
						assert.calledWith(apiStub, '/', null, requestConfig);
					}).then(done, done);
			});
		});
	});

	describe('#put', () => {
		it('should be called with correct base Url', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey,
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'put')
				.returns(stubResponse);

			put('/', null)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', null, requestConfig);
				}).then(done, done);
		});

		it('should correctly set access token and call api with it', (done) => {
			const stubResponse = { data: { test: 1234 } };
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey,
					'Authorization': `Bearer ${accessToken}`
				}
			};

			const apiStub = sandbox.stub(StApi.axiosInstance, 'put')
				.returns(stubResponse);

			setSession(testSession).then(() => {
				put('/', null)
					.then(() => {
						assert.calledOnce(apiStub);
						assert.calledWith(apiStub, '/', null, requestConfig);
					}).then(done, done);
			});
		});
	});

	describe('#postMultipartJsonImage', () => {
		it('should send data properly', (done) => {
			const requestBody = '--BOUNDARY\nContent-Disposition: form-data; name="data"\n' +
				'Content-Type: application/json\n\n{"type":"photo"}\n--BOUNDARY\n' +
				'Content-Disposition: form-data; name="image"; filename="image.jpg"\n' +
				'Content-Type: image/jpeg\n\nabc\n--BOUNDARY--';
			const requestConfig: AxiosRequestConfig = {
				baseURL: testApiURL,
				headers: {
					'x-api-key': testClientKey,
					'Content-Type': 'multipart/form-data; boundary=BOUNDARY'
				}
			};
			const stubResponse = { data: { test: 1234 } };

			const apiStub = sandbox.stub(StApi.axiosInstance, 'post')
				.returns(stubResponse);

			postMultipartJsonImage('/', {type: 'photo'}, 'image/jpeg', 'abc')
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, '/', requestBody, requestConfig);
				}).then(done, done);
		});
	});
});
