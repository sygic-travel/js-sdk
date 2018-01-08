import * as chai from 'chai';
import * as moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';
import { setUserSession } from '../User';
import { axiosInstance, get, post, put, setInvalidSessionHandler } from './StApi';

const testSession = getFreshSession();
const testApiURL = 'https://test.api';
const testClientKey = '987654321';
const accessToken = testSession.accessToken;

describe('StApi', () => {
	before((done) => {
		setEnvironment({
			stApiUrl: testApiURL,
			integratorApiKey: testClientKey
		});
		done();
	});

	beforeEach(() => {
		moxios.install(axiosInstance);
	});

	afterEach((done) => {
		moxios.uninstall(axiosInstance);
		setUserSession(null).then(() => { done(); });
	});

	describe('#get', () => {
		it('should be called with correct base Url', (done) => {
			get('/');
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			}, 5);
		});

		it('should be called with correct client key', (done) => {
			get('/');
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			}, 5);
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(testSession).then(() => {
				get('/');
				moxios.wait(() => {
					const request = moxios.requests.mostRecent();
					chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
					done();
				}, 5);
			});
		});

		it('should correctly call external session callback for invalid session error', (done) => {
			let callcount = 0;
			setInvalidSessionHandler(() => {
				callcount++;
			});

			get('/').catch((e) => {
				chai.expect(callcount).to.equal(1);
				chai.expect(e.message).to.equal('Invalid session');
			});

			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				request.respondWith({
					status: 401,
					response: {
						error: {
							id: 'apikey.invalid'
						}
					}
				});
				done();
			}, 5);
		});

		it('should correctly call external session callback for other error', (done) => {
			let callcount = 0;
			setInvalidSessionHandler(() => {
				callcount++;
			});

			get('/').catch((e) => {
				chai.expect(callcount).to.equal(0);
				chai.expect(e.message).to.equal('Request failed with status code 403');
			});

			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				request.respondWith({
					status: 403,
					response: {}
				});
				done();
			}, 5);
		});

		it('should not fail on session error without session callback', (done) => {
			get('/').catch((e) => {
				chai.expect(e.message).to.equal('Invalid session');
			});

			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				request.respondWith({
					status: 401,
					response: {
						error: {
							id: 'apikey.invalid'
						}
					}
				});
				done();
			}, 5);
		});
	});

	describe('#post', () => {
		it('should be called with correct base Url', (done) => {
			post('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			}, 5);
		});

		it('should be called with correct client key', (done) => {
			post('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			}, 5);
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(testSession).then(() => {
				post('/', null);
				moxios.wait(() => {
					const request = moxios.requests.mostRecent();
					chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
					done();
				}, 5);
			});
		});
	});

	describe('#put', () => {
		it('should be called with correct base Url', (done) => {
			put('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			}, 5);
		});

		it('should be called with correct client key', (done) => {
			put('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			}, 5);
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(testSession).then(() => {
				put('/', null);
				moxios.wait(() => {
					const request = moxios.requests.mostRecent();
					chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
					done();
				}, 5);
			});
		});
	});
});
