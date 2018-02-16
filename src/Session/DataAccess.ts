import { camelizeKeys, decamelizeKeys } from 'humps';

import {
	AuthenticationResponseCode,
	AuthResponse,
	RegistrationResponseCode,
	ResetPasswordResponseCode,
	Session,
	ThirdPartyAuthType,
	UserInfo,
	UserLicense,
	UserSettings
} from '.';
import { ApiResponse, SsoApi, StApi } from '../Api';
import { sessionCache, userCache } from '../Cache';

const SETTINGS_KEY = 'settings';
const CLIENT_SESSION_KEY = 'client_session';
const USER_SESSION_KEY = 'user_session';

export async function getUserSettings(): Promise<UserSettings> {
	let result: any = await userCache.get(SETTINGS_KEY);
	if (!result) {
		result = await getUserSettingsFromApi();
	}
	return camelizeKeys(result) as UserSettings;
}

export async function getUserSession(): Promise<Session | null> {
	return sessionCache.get(USER_SESSION_KEY);
}

export async function setUserSession(session: Session | null): Promise<void> {
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

export async function getSessionWithDeviceId(
	deviceId: string,
	devicePlatform: string
): Promise<AuthResponse> {
	const request: any = {
		grant_type: 'client_credentials',
		device_code: deviceId,
		device_platform: devicePlatform,
	};

	return authOnSso(request);
}

export async function getSessionWithJwt(
	jwt: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthResponse> {
	const request: any = {
		grant_type: 'external',
		token: jwt
	};

	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}
	if (deviceId) {
		request.device_code = deviceId;
	}

	return authOnSso(request);
}

export async function getSessionWithRefreshToken(
	token: string
): Promise<AuthResponse> {
	const request: any = {
		grant_type: 'refresh_token',
		refresh_token: token
	};

	return authOnSso(request);
}

export async function getSessionWithThirdPartyAuth(
	type: ThirdPartyAuthType,
	accessToken: string | null,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthResponse> {
	const request: any = {
		grant_type: type
	};
	if (accessToken) {
		request.access_token = accessToken;
	}
	if (devicePlatform) {
		request.device_platform = devicePlatform;
	}
	if (deviceId) {
		request.device_code = deviceId;
	}

	return authOnSso(request);
}

export async function getSessionWithPassword(
	email: string,
	password: string,
	deviceId?: string,
	devicePlatform?: string
): Promise<AuthResponse> {
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

	return authOnSso(request);
}

export async function registerUser(
	email: string,
	password: string,
	name: string
): Promise<RegistrationResponseCode> {
	const clientSession: Session = await getClientSession();
	const request: any = {
		username: email,
		email_is_verified: false,
		email,
		password,
		name
	};
	const response: ApiResponse = await SsoApi.post('user/register', request, clientSession);
	if (response.statusCode === 200) {
		return RegistrationResponseCode.OK;
	}
	if (response.statusCode === 401) {
		// client session is expired, let's reinitialize it
		await getClientSession();
		return registerUser(email, password, name);
	}
	if (response.statusCode === 409) {
		return RegistrationResponseCode.ERROR_ALREADY_REGISTERED;
	}
	if (response.data && response.data.type) {
		switch (response.data.type) {
			case 'validation.password.min_length':
				return RegistrationResponseCode.ERROR_PASSWORD_MIN_LENGTH;
			case 'validation.username.min_length':
			case 'validation.email.invalid_format':
				return RegistrationResponseCode.ERROR_EMAIL_INVALID_FORMAT;
			default:
				return RegistrationResponseCode.ERROR;
		}
	}
	return RegistrationResponseCode.ERROR;

}

export async function getUserInfo(): Promise<UserInfo> {
	const apiResponse = await StApi.get('user/info');
	if (!apiResponse.data.hasOwnProperty('user')) {
		throw new Error('Wrong API response');
	}
	const userData = apiResponse.data.user;
	const license: UserLicense | null = userData.premium ? {
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
		license
	} as UserInfo;
}

export async function requestCancelAccount(): Promise<void> {
	await StApi.post('user/cancel-account', null);
}

export async function deleteAccount(id: string, hash: string): Promise<void> {
	await StApi.delete_('users', {id, hash});
}

export async function resetPassword(email: string): Promise<ResetPasswordResponseCode> {
	const clientSession: Session = await getClientSession();
	const request: any = {
		email,
	};
	const response: ApiResponse = await SsoApi.post('user/reset-password', request, clientSession);

	if (response.statusCode === 401) {
		await getClientSession();
		return resetPassword(email);
	}

	switch (response.statusCode) {
		case 200: return ResetPasswordResponseCode.OK;
		case 404: return ResetPasswordResponseCode.ERROR_USER_NOT_FOUND;
		case 422: return ResetPasswordResponseCode.ERROR_EMAIL_INVALID_FORMAT;
		default: return ResetPasswordResponseCode.ERROR;
	}
}

async function authOnSso(request): Promise<AuthResponse> {
	const response: ApiResponse = await SsoApi.post('oauth2/token', request);
	const now = new Date();
	if (response.statusCode === 200) {
		return {
			code: AuthenticationResponseCode.OK,
			session: {
				accessToken: response.data.access_token,
				refreshToken: response.data.refresh_token,
				expirationTimestamp: now.getTime() + (response.data.expires_in * 1000),
				suggestedRefreshTimestamp: now.getTime() + (response.data.expires_in * 500)
			} as Session
		};
	}
	let code: AuthenticationResponseCode = AuthenticationResponseCode.ERROR;
	if (response.statusCode === 401) {
		code = AuthenticationResponseCode.ERROR_INVALID_CREDENTIALS;
	}
	return {
		code,
		session: null
	};

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
		const authResult: AuthResponse = await authOnSso({grant_type: 'client_credentials'});
		if (!authResult.session) {
			throw new Error('Unable to login client. Please check ssoClientId in settings.');
		}
		clientSession = authResult.session;
	}
	await sessionCache.set(CLIENT_SESSION_KEY, clientSession);
	return clientSession;
}
