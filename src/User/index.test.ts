import * as chai from 'chai';
import { getUserInfo, setUserSession } from '.';

describe('UserController', () => {
	describe('#getUserInfo', () => {
		it('should throw an exception when no user session is set', async () => {
			await setUserSession(null);
			getUserInfo().catch((e: Error) => {
				chai.expect(e.message).equal('User session is not set');
			});
		});
	});
});
