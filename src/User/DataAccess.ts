import { camelizeKeys, decamelizeKeys } from 'humps';

import { UserSettings } from '.';
import { userCache as userCache } from '../Cache';
import { get, put } from '../Xhr';

const SETTINGS_KEY = 'settings';

export async function getUserSettings(): Promise<UserSettings> {
	let result: any = null;
	const fromCache: any = await userCache.get(SETTINGS_KEY);

	if (!fromCache) {
		result = await getFromApi();
	} else {
		result = fromCache;
	}

	return camelizeKeys(result) as UserSettings;
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	const settingsData = decamelizeKeys(settings);
	await userCache.set(SETTINGS_KEY, settingsData);
	await put('users/me', settingsData);
	return settings;
}

export async function handleSettingsChange(): Promise<void> {
	await getFromApi();
}

async function getFromApi(): Promise<object> {
	const apiResponse = await get('users/me');
	if (!apiResponse.data.hasOwnProperty('settings')) {
		throw new Error('Wrong API response');
	}
	const result = apiResponse.data.settings;
	await userCache.set(SETTINGS_KEY, result);
	return result;
}
