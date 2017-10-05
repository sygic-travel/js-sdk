import { camelizeKeys, decamelizeKeys } from 'humps';

import { Session, ThirdPartyAuthType, UserSettings } from '.';
import { ApiResponse, SsoApi, StApi } from '../Api';
import { userCache as userCache } from '../Cache';

const SETTINGS_KEY = 'settings';

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

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	const settingsData = decamelizeKeys(settings);
	await userCache.set(SETTINGS_KEY, settingsData);
	await StApi.put('users/me', settingsData);
	return settings;
}

export async function handleSettingsChange(): Promise<void> {
	await getUserSettingsFromApi();
}

export async function getSessionByDeviceId(deviceId: string, devicePlatform?: string): Promise<Session> {
	const request: any = {
		grant_type: 'client_credentials',
		device_code: deviceId
	};

	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}

	return getSessionFromSso(request);
}

export async function getSessionByThirdPartyAuth(
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

export async function getSessionByPassword(
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
