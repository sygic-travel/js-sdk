import { favoritesCache, tripsDetailedCache, userCache } from '../Cache';
import { reset as resetChanges } from '../Changes';
import * as Dao from './DataAccess';
import {
	AuthenticationResponseCode,
	AuthResponse,
	RegistrationResponseCode,
	Session
} from './Session';
import {
	ThirdPartyAuthType,
	UserInfo,
	UserLicense,
	UserSettings
} from './User';

export {
	AuthenticationResponseCode,
	AuthResponse,
	RegistrationResponseCode,
	ThirdPartyAuthType,
	Session,
	UserInfo,
	UserLicense,
	UserSettings
};

export async function getUserSession(): Promise<Session | null> {
	let session: Session | null = await Dao.getUserSession();
	const now = new Date();
	if (session && session.refreshToken &&
		(now.getTime() > session.suggestedRefreshTimestamp || !session.suggestedRefreshTimestamp)
	) {
		const authResponse: AuthResponse = await Dao.getSessionWithRefreshToken(session.refreshToken);
		if (authResponse.code === AuthenticationResponseCode.OK) {
			setUserSession(authResponse.session);
			session = authResponse.session;
		}
	}
	return session;
}

export async function getUserSettings(): Promise<UserSettings> {
	return Dao.getUserSettings();
}

export async function updateUserSettings(settings: UserSettings): Promise<UserSettings> {
	return Dao.updateUserSettings(settings);
}

export async function setUserSession(userSession: Session | null): Promise<void> {
	await userCache.reset();
	await favoritesCache.reset();
	await tripsDetailedCache.reset();
	resetChanges();
	await Dao.setUserSession(userSession);
}

export async function handleSettingsChange(): Promise<void> {
	return Dao.handleSettingsChange();
}

export async function loginUserWithDeviceId(
	deviceId: string,
	devicePlatform: string
): Promise<AuthenticationResponseCode> {
	const authResponse: AuthResponse = await Dao.getSessionWithDeviceId(deviceId, devicePlatform);
	if (authResponse.code === AuthenticationResponseCode.OK) {
		setUserSession(authResponse.session);
	}
	return authResponse.code;
}

export async function loginUserWithPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthenticationResponseCode> {
	const authResponse: AuthResponse = await Dao.getSessionWithPassword(email, password, deviceId, devicePlatform);
	if (authResponse.code === 'OK') {
		setUserSession(authResponse.session);
	}
	return authResponse.code;
}

export async function loginUserWithFacebook(
	accessToken: string | null,
	authorizationCode: string | null,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthenticationResponseCode> {
	const authResponse: AuthResponse = await Dao.getSessionWithThirdPartyAuth(
		ThirdPartyAuthType.facebook, accessToken, authorizationCode, deviceId, devicePlatform
	);
	if (authResponse.code === AuthenticationResponseCode.OK) {
		setUserSession(authResponse.session);
	}
	return authResponse.code;
}

export async function loginUserWithGoogle(
	accessToken: string | null,
	authorizationCode: string | null,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthenticationResponseCode> {
	const authResponse: AuthResponse = await Dao.getSessionWithThirdPartyAuth(
		ThirdPartyAuthType.google, accessToken, authorizationCode, deviceId, devicePlatform
	);
	if (authResponse.code === AuthenticationResponseCode.OK) {
		setUserSession(authResponse.session);
	}
	return authResponse.code;
}

export async function loginUserWithJwt(
	jwt: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthenticationResponseCode> {
	const authResponse: AuthResponse = await Dao.getSessionWithJwt(
		jwt, deviceId, devicePlatform
	);
	if (authResponse.code === AuthenticationResponseCode.OK) {
		setUserSession(authResponse.session);
	}
	return authResponse.code;
}

export async function registerUser(
	email: string,
	password: string,
	name: string
): Promise<RegistrationResponseCode> {
	await Dao.registerUser(email, password, name);
	return RegistrationResponseCode.OK;
}

export async function getUserInfo(): Promise<UserInfo> {
	const session = await getUserSession();
	if (!session) {
		throw new Error('User session is not set');
	}
	return Dao.getUserInfo();
}

export async function deleteAccount(id: string, hash: string): Promise<void> {
	await Dao.deleteAccount(id, hash);
}

export async function requestCancelAccount(): Promise<void> {
	await Dao.requestCancelAccount();
}
