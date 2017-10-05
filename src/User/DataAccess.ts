import { camelizeKeys, decamelizeKeys } from 'humps';

import { UserSession, UserSettings } from '.';
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

export async function getSessionByDeviceId(deviceId: string, devicePlatform?: string): Promise<UserSession> {
	const request: any = {
		grant_type: 'client_credentials',
		device_code: deviceId
	};

	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}

	const response: ApiResponse = await SsoApi.post('oauth2/token', request);
	return {
		accessToken: response.data.access_token,
		refreshToken: response.data.refresh_token
	} as UserSession;
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
