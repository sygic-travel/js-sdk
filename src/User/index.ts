import { favoritesCache, tripsDetailedCache, userCache } from '../Cache';
import { reset as resetChanges } from '../Changes';
import * as Dao from './DataAccess';
import { Session } from './Session';
import { ThirdPartyAuthType, UserInfo, UserLicence, UserSettings } from './User';

export {
	ThirdPartyAuthType,
	Session,
	UserInfo,
	UserLicence,
	UserSettings
};
export { getUserSession } from './DataAccess';

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
	await Dao.setUserSession(userSession);
}

export async function handleSettingsChange(): Promise<void> {
	return Dao.handleSettingsChange();
}

export async function loginUserWithDeviceId(deviceId: string, devicePlatform?: string): Promise<void> {
	const session: Session = await Dao.getSessionWithDeviceId(deviceId, devicePlatform);
	setUserSession(session);
}

export async function loginUserWithPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionWithPassword(email, password, deviceId, devicePlatform);
	setUserSession(session);
}

export async function loginUserWithFacebook(
	accessToken: string|null,
	authorizationCode: string|null,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionWithThirdPartyAuth(
		'facebook', accessToken, authorizationCode, deviceId, devicePlatform
	);
	setUserSession(session);
}

export async function loginUserWithGoogle(
	accessToken: string|null,
	authorizationCode: string|null,
	deviceId?: string,
	devicePlatform?: string
): Promise<void> {
	const session: Session = await Dao.getSessionWithThirdPartyAuth(
		'google', accessToken, authorizationCode, deviceId, devicePlatform
	);
	setUserSession(session);
}

export async function registerUser(
	email: string,
	password: string,
	name: string
): Promise<void> {
	await Dao.registerUser(email, password, name);
}

export async function getUserInfo(): Promise<UserInfo> {
	const session = await Dao.getUserSession();
	if (!session) {
		throw new Error('User session is not set');
	}
	return Dao.getUserInfo();
}
