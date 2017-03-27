import { get } from './Xhr';
import { setEnvironment } from '../Settings';
import { expect } from 'chai';
//import {} from 'sinon';

let testApiURL = '';
let testClientKey = '987654321';

describe('Xhr', () => {
	before(done => {
		setEnvironment(testApiURL, testClientKey);
		done();
	});


	describe.skip('get', () => {
		it('should be called with correct base Url', done => {

		});

		it('should be called with correct client key', done => {

		});
	});
});
