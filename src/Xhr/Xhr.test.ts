import { setEnvironment } from '../Settings';
import { get } from './Xhr';

const testApiURL = '';
const testClientKey = '987654321';

describe('Xhr', () => {
	before((done) => {
		setEnvironment(testApiURL, testClientKey);
		done();
	});

	describe.skip('get', () => {
		it('should be called with correct base Url', (done) => {
			done();
		});

		it('should be called with correct client key', (done) => {
			done();
		});
	});
});
