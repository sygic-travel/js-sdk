import {
	getUserSettings,
	loginUserByDeviceId,
	loginUserByFacebook,
	loginUserByGoogle,
	loginUserByPassword,
	setUserSession,
	updateUserSettings,
	Session,
	UserSettings,
} from '../User';

export default class UserModule {
	public setUserSession(userSession: Session|null): Promise<void> {
		return setUserSession(userSession);
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
	public loginUserByDeviceId(deviceId: string, devideCode?: string): Promise<void> {
		return loginUserByDeviceId(deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserByPassword(email: string, password: string, deviceId?: string, devideCode?: string): Promise<void> {
		return loginUserByPassword(email, password, deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public loginUserByFacebook(
		accessToken: string|null,
		authorizationCode: string|null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<void> {
		return loginUserByFacebook(accessToken, authorizationCode, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public loginUserByGoogle(
		accessToken: string|null,
		authorizationCode: string|null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<void> {
		return loginUserByGoogle(accessToken, authorizationCode, deviceId, devicePlatform);
	}
}
