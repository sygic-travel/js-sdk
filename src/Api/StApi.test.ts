import * as chai from 'chai';
import * as moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { setUserSession } from '../User';
import { axiosInstance, get, post, put } from './StApi';

const testApiURL = 'https://test.api';
const testClientKey = '987654321';
const accessToken = '0987654321';

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

	afterEach(() => {
		moxios.uninstall(axiosInstance);
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
			});
		});

		it('should correctly set access token and call api with it', async () => {
			await setUserSession({
				accessToken,
				refreshToken: 'refresh_token'
			});
			get('/');
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
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
			setUserSession({
				accessToken,
				refreshToken: 'refresh_token'
			});
			post('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
				done();
			}, 5);
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
			setUserSession({
				accessToken,
				refreshToken: 'refresh_token'
			});
			put('/', null);
			moxios.wait(() => {
				const request = moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
				done();
			}, 5);
		});
	});
});
