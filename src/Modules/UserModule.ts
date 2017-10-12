import {
	getUserInfo,
	getUserSession,
	getUserSettings,
	loginUserWithDeviceId,
	loginUserWithFacebook,
	loginUserWithGoogle,
	loginUserWithPassword,
	registerUser,
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
	public setUserSession(userSession: Session|null): Promise<void> {
		return setUserSession(userSession);
	}

	/**
	 * @experimental
	 */
	public getUserSession(): Promise<Session|null> {
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
	public loginUserWithDeviceId(deviceId: string, devideCode?: string): Promise<void> {
		return loginUserWithDeviceId(deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserWithPassword(email: string, password: string, deviceId?: string, devideCode?: string): Promise<void> {
		return loginUserWithPassword(email, password, deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserWithFacebook(
		accessToken: string|null,
		authorizationCode: string|null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<void> {
		return loginUserWithFacebook(accessToken, authorizationCode, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public loginUserWithGoogle(
		accessToken: string|null,
		authorizationCode: string|null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<void> {
		return loginUserWithGoogle(accessToken, authorizationCode, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public registerUser(
		email: string,
		password: string,
		name: string
	): Promise<void> {
		return registerUser(email, password, name);
	}

	/**
	 * @experimental
	 */
	public getUserInfo(): Promise<UserInfo> {
		return getUserInfo();
	}
}
