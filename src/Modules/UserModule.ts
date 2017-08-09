import { getUserSettings, setUserSession, updateUserSettings, UserSettings } from '../User';

export default class UserModule {
	public setUserSession(key: string | null, token: string | null): Promise<void> {
		return setUserSession(key, token);
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
}
