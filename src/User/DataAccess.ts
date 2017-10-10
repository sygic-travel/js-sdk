import { camelizeKeys, decamelizeKeys } from 'humps';

import { Session, ThirdPartyAuthType, UserInfo, UserLicence, UserSettings } from '.';
import { ApiResponse, SsoApi, StApi } from '../Api';
import { sessionCache, userCache } from '../Cache';

const SETTINGS_KEY = 'settings';
const CLIENT_SESSION_KEY = 'client_session';
const USER_SESSION_KEY = 'user_session';

export async function getUserSettings(): Promise<UserSettings> {
	let result: any = null;
	const fromCache: any = await userCache.get(SETTINGS_KEY);

	if (!fromCache) {
		result = await getUserSettingsFromApi();
	} else {
		result = fromCache;
	}

	return camelizeKeys(result) as UserSettings;
}

export async function getUserSession(): Promise<Session|null> {
	return sessionCache.get(USER_SESSION_KEY);
}

export async function setUserSession(session: Session|null): Promise<void> {
	return sessionCache.set(USER_SESSION_KEY, session);
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	const settingsData = decamelizeKeys(settings);
	await userCache.set(SETTINGS_KEY, settingsData);
	await StApi.put('users/me', settingsData);
	return settings;
}

export async function handleSettingsChange(): Promise<void> {
	await getUserSettingsFromApi();
}

export async function getSessionWithDeviceId(deviceId: string, devicePlatform?: string): Promise<Session> {
	const request: any = {
		grant_type: 'client_credentials',
		device_code: deviceId
	};

	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}

	return getSessionFromSso(request);
}

export async function getSessionWithThirdPartyAuth(
	type: ThirdPartyAuthType,
	accessToken: string|null,
	authorizationCode: string|null,
	deviceId?: string,
	devicePlatform?: string
): Promise<Session> {
	if (accessToken && authorizationCode) {
		throw new Error('Only one of accessToken, authorizationCode must be provided');
	}

	const request: any = {
		grant_type: type
	};
	if (accessToken) {
		request.access_token = accessToken;
	}
	if (authorizationCode) {
		request.authorization_code = authorizationCode;
	}
	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}
	if (deviceId) {
		request.device_code = deviceId;
	}

	return getSessionFromSso(request);
}

export async function getSessionWithPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<Session> {
	const request: any = {
		grant_type: 'password',
		username: email,
		password
	};

	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}
	if (deviceId) {
		request.device_code = deviceId;
	}

	return getSessionFromSso(request);
}

export async function registerUser(
	email: string,
	password: string,
	name: string
): Promise<void> {
	const clientSession: Session = await getClientSession();
	const request: any = {
		username: email,
		email_is_verified: false,
		email,
		password,
		name
	};
	await SsoApi.post('user/register', request, clientSession);
}

export async function getUserInfo(): Promise<UserInfo> {
	const apiResponse = await StApi.get('user/info');
	if (!apiResponse.data.hasOwnProperty('user')) {
		throw new Error('Wrong API response');
	}
	const userData = apiResponse.data.user;
	const licence: UserLicence|null = userData.premium ? {
		name: userData.premium.name,
		expirationAt: userData.premium.expiration_at,
		isActive: userData.premium.is_active,
	} : null;

	return {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		isEmailSubscribed: userData.is_email_subscribed,
		isRegistered: userData.is_registered,
		photoUrl: userData.photo ? userData.photo.url : null,
		dateCreated: userData.created_date,
		roles: userData.roles,
		licence
	} as UserInfo;
}

async function getSessionFromSso(request): Promise<Session> {
	const response: ApiResponse = await SsoApi.post('oauth2/token', request);
	return {
		accessToken: response.data.access_token,
		refreshToken: response.data.refresh_token
	} as Session;
}

async function getUserSettingsFromApi(): Promise<object> {
	const apiResponse = await StApi.get('users/me');
	if (!apiResponse.data.hasOwnProperty('settings')) {
		throw new Error('Wrong API response');
	}
	const result = apiResponse.data.settings;
	await userCache.set(SETTINGS_KEY, result);
	return result;
}

async function getClientSession(): Promise<Session> {
	let clientSession: Session = await sessionCache.get(CLIENT_SESSION_KEY);
	if (!clientSession) {
		clientSession = await getSessionFromSso({grant_type: 'client_credentials'});
	}
	await sessionCache.set(CLIENT_SESSION_KEY, clientSession);
	return clientSession;
}
