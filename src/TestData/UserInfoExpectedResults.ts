import { UserInfo, UserLicence } from '../User';

export const userInfo: UserInfo = {
	id: '5665644fa0269',
	name: 'User',
	email: 'email@example.com',
	isEmailSubscribed: true,
	isRegistered: true,
	roles: ['default', 'admin'],
	dateCreated: '2015-12-07T10:49:51+00:00',
	photoUrl: 'http://example.com/avatar.png',
	licence: {
		name: 'Sygic Travel Premium',
		expirationAt: null,
		isActive: true
	} as UserLicence
};
