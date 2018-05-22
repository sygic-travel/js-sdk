import { Session, UserInfo, UserLicense} from '../Session';
import { PrivacyConsentsType } from '../Session/User';
import { cloneDeep } from '../Util';
import { tokenData } from './SsoApiResponses';

export const userInfo: UserInfo = {
	id: '5665644fa0269',
	name: 'User',
	email: 'email@example.com',
	isEmailSubscribed: true,
	isRegistered: true,
	roles: ['default', 'admin'],
	dateCreated: '2015-12-07T10:49:51+00:00',
	photoUrl: 'http://example.com/avatar.png',
	license: {
		name: 'Sygic Travel Premium',
		expirationAt: null,
		isActive: true
	} as UserLicense,
	privacyConsents: [{
		agreed: true,
		answeredAt: '2018-05-26T12:12:12+02:00',
		type: PrivacyConsentsType.LOCATION
	}]
};

export const session: Session = {
	accessToken: tokenData.access_token,
	refreshToken: tokenData.refresh_token,
	suggestedRefreshTimestamp: 11800000,
	expirationTimestamp: 13600000
};

export const getFreshSession = (): Session => {
	const testSession: Session = cloneDeep(session);
	const now = new Date();
	testSession.suggestedRefreshTimestamp = now.getTime() + 10000;
	testSession.expirationTimestamp = now.getTime() + 20000;
	return testSession;
};
