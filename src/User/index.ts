import { favoritesCache, tripsDetailedCache, userCache } from '../Cache';
import { reset as resetChanges } from '../Changes';
import * as Dao from './DataAccess';
import { Session } from './Session';
import * as UserSessionManager from './Session';
import { ThirdPartyAuthType, UserSettings } from './User';

export {
	ThirdPartyAuthType,
	Session,
	UserSettings,
};
export { getUserSession } from './Session';

export async function getUserSettings(): Promise<UserSettings> {
	return await Dao.getUserSettings();
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	return await Dao.updateUserSettings(settings);
}

export async function setUserSession(userSession: Session|null): Promise<void> {
	await userCache.reset();
	await favoritesCache.reset();
	await tripsDetailedCache.reset();
	resetChanges();
	return UserSessionManager.setUserSession(userSession);
}

export async function handleSettingsChange(): Promise<void> {
	return Dao.handleSettingsChange();
}

export async function loginUserByDeviceId(deviceId: string, devicePlatform?: string): Promise<void> {
	const session: Session = await Dao.getSessionByDeviceId(deviceId, devicePlatform);
	setUserSession(session);
}

export async function loginUserByPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionByPassword(email, password, deviceId, devicePlatform);
	setUserSession(session);
}

export async function loginUserByFacebook(
	accessToken: string|null,
	authorizationCode: string|null,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionByThirdPartyAuth(
		'facebook', accessToken, authorizationCode, deviceId, devicePlatform
	);
	setUserSession(session);
}

export async function loginUserByGoogle(
	accessToken: string|null,
	authorizationCode: string|null,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionByThirdPartyAuth(
		'google', accessToken, authorizationCode, deviceId, devicePlatform
	);
	setUserSession(session);
}
