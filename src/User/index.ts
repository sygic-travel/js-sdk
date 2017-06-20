import { favoritesCache, tripsDetailedCache, userCache } from '../Cache';
import { reset as resetChanges } from '../Changes';
import * as Settings from '../Settings';
import * as Dao from './DataAccess';
import { UserSettings } from './User';

export { UserSettings } from './User';

export async function getUserSettings(): Promise<UserSettings> {
	return await Dao.getUserSettings();
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	return await Dao.updateUserSettings(settings);
}

export async function setUserSession(key: string | null, token: string | null): Promise<void> {
	await userCache.reset();
	await favoritesCache.reset();
	await tripsDetailedCache.reset();
	resetChanges();
	return Settings.setUserSession(key, token);
}

export async function handleSettingsChange(): Promise<void> {
	return Dao.handleSettingsChange();
}
