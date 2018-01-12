import {
	AuthenticationResponseCode,
	deleteAccount,
	getUserInfo,
	getUserSession,
	getUserSettings,
	loginUserWithDeviceId,
	loginUserWithFacebook,
	loginUserWithGoogle,
	loginUserWithJwt,
	loginUserWithPassword,
	registerUser,
	RegistrationResponseCode,
	requestCancelAccount,
	Session,
	setUserSession,
	updateUserSettings,
	UserInfo,
	UserSettings,
} from '../User';

export default class UserModule {
	/**
	 * @experimental
	 */
	public requestCancelAccount(): Promise<void> {
		return requestCancelAccount();
	}

	/**
	 * @experimental
	 */
	public deleteAccount(id: string, hash: string): Promise<void> {
		return deleteAccount(id, hash);
	}

	/**
	 * @experimental
	 */
	public setUserSession(userSession: Session | null): Promise<void> {
		return setUserSession(userSession);
	}

	/**
	 * @experimental
	 */
	public getUserSession(): Promise<Session | null> {
		return getUserSession();
	}

	/**
	 * @experimental
	 */
	public getUserSettings(): Promise<UserSettings> {
		return getUserSettings();
	}

	/**
	 * @experimental
	 */
	public updateUserSettings(settings: UserSettings): Promise<UserSettings> {
		return updateUserSettings(settings);
	}

	/**
	 * @experimental
	 */
	public loginUserWithDeviceId(deviceId: string, devideCode: string): Promise<AuthenticationResponseCode> {
		return loginUserWithDeviceId(deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserWithJwt(jwt: string, deviceId?: string, devideCode?: string): Promise<AuthenticationResponseCode> {
		return loginUserWithJwt(jwt, deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserWithPassword(
		email: string,
		password: string,
		deviceId?: string,
		devideCode?: string
	): Promise<AuthenticationResponseCode> {
		return loginUserWithPassword(email, password, deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserWithFacebook(
		accessToken: string | null,
		authorizationCode: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<AuthenticationResponseCode> {
		return loginUserWithFacebook(accessToken, authorizationCode, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public loginUserWithGoogle(
		accessToken: string | null,
		authorizationCode: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<AuthenticationResponseCode> {
		return loginUserWithGoogle(accessToken, authorizationCode, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public registerUser(
		email: string,
		password: string,
		name: string
	): Promise<RegistrationResponseCode> {
		return registerUser(email, password, name);
	}

	/**
	 * @experimental
	 */
	public getUserInfo(): Promise<UserInfo> {
		return getUserInfo();
	}
}
