import { Session, UserInfo, UserLicense} from '../User';
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
	} as UserLicense
};

export const session: Session = {
	accessToken: tokenData.access_token,
	refreshToken: tokenData.refresh_token,
	suggestedRefreshTimestamp: 11800000,
	expirationTimestamp: 13600000
};
