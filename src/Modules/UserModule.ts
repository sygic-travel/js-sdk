import {
	getUserSettings,
	loginUserByDeviceId,
	setUserSession,
	updateUserSettings,
	UserSession,
	UserSettings,
} from '../User';

export default class UserModule {
	public setUserSession(userSession: UserSession|null): Promise<void> {
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
}
