import * as chai from 'chai';
import * as Moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';
import { axiosInstance, get, post } from './SsoApi';

const testApiURL = 'https://test.api/';
const ssoClient = 'sso_client';
const testSession = getFreshSession();

describe('SsoApi', () => {
	before((done) => {
		setEnvironment({
			ssoClientId: ssoClient,
			ssoApiUrl: testApiURL
		});
		done();
	});

	beforeEach(() => {
		Moxios.install(axiosInstance);
	});

	afterEach(() => {
		Moxios.uninstall(axiosInstance);
	});

	describe('#get', () => {
		it('should be called with correct base Url', (done) => {
			get('test');
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			}, 5);
		});
	});

	describe('#post', () => {
		it('should be called with correct base Url', (done) => {
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			}, 5);
		});

		it('should be called with correct Content-Type header', (done) => {
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Content-Type']).to.equal('application/json');
				done();
			}, 5);
		});

		it('should add client id to data if missing', (done) => {
			post('/', {});
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(JSON.parse(request.config.data)['client_id']).to.equal(ssoClient);
				done();
			}, 5);
		});

		it('should not touch client id to data if present', (done) => {
			const clientId = 'test_id';
			post('/', {
				client_id: clientId
			});
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(JSON.parse(request.config.data)['client_id']).to.equal(clientId);
				done();
			}, 5);
		});

		it('should add Authorization header if session is passed', (done) => {
			post('/', {}, testSession);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + testSession.accessToken);
				done();
			}, 5);
		});
	});

});
