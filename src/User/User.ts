import { listToEnum } from '../Util';

export interface UserSettings {
	homePlaceId: string|null;
	workPlaceId: string|null;
}

const thirdPartyAuthTypes = listToEnum([
	'facebook',
	'google'
]);
export function isThirdPartyAuthType(val: any): val is ThirdPartyAuthType {
	return typeof val === 'string' && thirdPartyAuthTypes[val] === val;
}
export type ThirdPartyAuthType = keyof typeof thirdPartyAuthTypes;

export interface UserInfo {
	id: string;
	name: string|null;
	email: string|null;
	roles: string[];
	dateCreated: string;
	isEmailSubscribed: boolean;
	isRegistered: boolean;
	photoUrl: string|null;
	licence: UserLicence|null;
}

export interface UserLicence {
	isActive: boolean;
	name: string;
	expirationAt: string|null;
}
