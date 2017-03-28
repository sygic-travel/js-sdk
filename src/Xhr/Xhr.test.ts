import * as chai from 'chai';
import * as Moxios from 'moxios';

import { setEnvironment } from '../Settings';
import { axiosInstance, get } from './Xhr';

const testApiURL = 'https://test.api';
const testClientKey = '987654321';

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
	});
});
