import * as chai from 'chai';
import * as Moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { axiosInstance, post } from './StTrackingApi';

const testApiURL = 'https://test.api/';

describe('StTrackingApi', () => {
	before((done) => {
		setEnvironment({
			stTrackingApiUrl: testApiURL
		});
		done();
	});

	beforeEach(() => {
		Moxios.install(axiosInstance);
	});

	afterEach(() => {
		Moxios.uninstall(axiosInstance);
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
	});
});
