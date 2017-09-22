import * as chai from 'chai';
import * as Moxios from 'moxios';

import { setEnvironment, setUserSession } from '../Settings';
import { axiosInstance, get, post, put } from './Xhr';

const testApiURL = 'https://test.api';
const testClientKey = '987654321';

const apiKey = '1234567890';
const accessToken = '0987654321';

describe('Xhr', () => {
	before((done) => {
		setEnvironment(testApiURL, testClientKey);
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
			get('/');
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			});
		});

		it('should be called with correct client key', (done) => {
			get('/');
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			});
		});

		it('should correctly set api key and call api with it', (done) => {
			setUserSession(apiKey, null);
			get('/');
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.url).to.equal(testApiURL + '/?api_key=' + apiKey);
				done();
			});
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(null, accessToken);
			get('/');
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
				done();
			});
		});

		it('should throw error when api key and access token set passed together', () => {
			return chai.expect(() => setUserSession(apiKey, accessToken))
				.to.throw('Can\'t set session with both key and token.');
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

		it('should be called with correct client key', (done) => {
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			});
		});

		it('should correctly set api key and call api with it', (done) => {
			setUserSession(apiKey, null);
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.url).to.equal(testApiURL + '/?api_key=' + apiKey);
				done();
			});
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(null, accessToken);
			post('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
				done();
			});
		});
	});

	describe('#put', () => {
		it('should be called with correct base Url', (done) => {
			put('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.baseURL).to.equal(testApiURL);
				done();
			});
		});

		it('should be called with correct client key', (done) => {
			put('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['x-api-key']).to.equal(testClientKey);
				done();
			});
		});

		it('should correctly set api key and call api with it', (done) => {
			setUserSession(apiKey, null);
			put('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.url).to.equal(testApiURL + '/?api_key=' + apiKey);
				done();
			});
		});

		it('should correctly set access token and call api with it', (done) => {
			setUserSession(null, accessToken);
			put('/', null);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.headers['Authorization']).to.equal('Bearer ' + accessToken);
				done();
			});
		});
	});
});
