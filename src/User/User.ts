export interface UserSettings {
	homePlaceId: string | null;
	workPlaceId: string | null;
}

export enum ThirdPartyAuthType {
	facebook = 'facebook',
	google = 'google'
}

export function isThirdPartyAuthType(authType: string): boolean {
	return !!ThirdPartyAuthType[authType];
}

export interface UserInfo {
	id: string;
	name: string | null;
	email: string | null;
	roles: string[];
	dateCreated: string;
	isEmailSubscribed: boolean;
	isRegistered: boolean;
	photoUrl: string | null;
	license: UserLicense | null;
}

export interface UserLicense {
	isActive: boolean;
	name: string;
	expirationAt: string | null;
}
