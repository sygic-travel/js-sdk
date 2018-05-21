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
	privacyConsents: PrivacyConsents[];
}

export interface UserLicense {
	isActive: boolean;
	name: string;
	expirationAt: string | null;
}

export interface PrivacyConsents {
	type: PrivacyConsentsType;
	agreed: boolean;
	answeredAt: string | null;
}

export enum PrivacyConsentsType {
	MARKETING = 'marketing',
	USAGE = 'usage',
	LOCATION = 'location'
}

export interface PrivacyConsentPayload {
	type: PrivacyConsentsType;
	flow: PrivacyConsentsFlow;
	consentText: string | null;
	agreed: boolean;
}

export enum PrivacyConsentsFlow {
	DELAYED = 'delayed',
	SETTINGS = 'settings',
	SIGN_IN = 'sign_in',
	UPDATE = 'update'
}
