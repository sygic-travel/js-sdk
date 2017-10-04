import * as chai from 'chai';
import * as Moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { axiosInstance, get, post } from './SsoApi';

const testApiURL = 'https://test.api/';
const ssoClient = 'sso_client'

describe('StApi', () => {
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
			});
		});
	});

	describe('#post', () => {
		it('should be called with correct base Url', (done) => {
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			});
		});

		it('should be called with correct Content-Type header', (done) => {
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Content-Type']).to.equal('application/json');
				done();
			});
		});

		it('should add client id to data if missing', (done) => {
			post('/', {});
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(JSON.parse(request.config.data)['client_id']).to.equal(ssoClient);
				done();
			});
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
			});
		});
	});

});
