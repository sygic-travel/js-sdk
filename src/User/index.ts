import { favoritesCache, tripsDetailedCache, userCache } from '../Cache';
import { reset as resetChanges } from '../Changes';
import * as Dao from './DataAccess';
import { UserSettings } from './User';
import { UserSession } from './UserSession';
import * as UserSessionManager from './UserSession';

export {
	UserSession,
	UserSettings,
};
export { getSession } from './UserSession';

export async function getUserSettings(): Promise<UserSettings> {
	return await Dao.getUserSettings();
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	return await Dao.updateUserSettings(settings);
}

export async function setUserSession(userSession: UserSession|null): Promise<void> {
	await userCache.reset();
	await favoritesCache.reset();
	await tripsDetailedCache.reset();
	resetChanges();
	return UserSessionManager.setSession(userSession);
}

export async function handleSettingsChange(): Promise<void> {
	return Dao.handleSettingsChange();
}

export async function loginUserByDeviceId(deviceId: string, devicePlatform?: string): Promise<void> {
	const session: UserSession = await Dao.getSessionByDeviceId(deviceId, devicePlatform);
	setUserSession(session);
}

export async function loginUserByPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: UserSession = await Dao.getSessionByPassword(email, password, deviceId, devicePlatform);
	setUserSession(session);
}
	setUserSession(session);
}
