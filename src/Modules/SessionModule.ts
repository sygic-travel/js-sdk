import {
	AuthenticationResponseCode,
	deleteAccount,
	getSession,
	getUserInfo,
	getUserSettings,
	register,
	RegistrationResponseCode,
	requestCancelAccount,
	resetPassword,
	ResetPasswordResponseCode,
	Session,
	setSession,
	signInWithCredentials,
	signInWithDeviceId,
	signInWithFacebookAccessToken,
	signInWithGoogleIdToken,
	signInWithJwtToken,
	updateUserSettings,
	UserInfo,
	UserSettings,
} from '../Session';

export default class SessionModule {
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
	public setSession(userSession: Session | null): Promise<void> {
		return setSession(userSession);
	}

	/**
	 * @experimental
	 */
	public getSession(): Promise<Session | null> {
		return getSession();
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
	public signInWithDeviceId(deviceId: string, devideCode: string): Promise<AuthenticationResponseCode> {
		return signInWithDeviceId(deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public signInWithJwtToken(jwt: string, deviceId?: string, devideCode?: string): Promise<AuthenticationResponseCode> {
		return signInWithJwtToken(jwt, deviceId, devideCode);
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
		return signInWithCredentials(email, password, deviceId, devideCode);
	}

	/**
	 * @experimental
	 */
	public signInWithFacebookAccessToken(
		token: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<AuthenticationResponseCode> {
		return signInWithFacebookAccessToken(token, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public signInWithGoogleIdToken(
		token: string | null,
		deviceId?: string,
		devicePlatform?: string
	): Promise<AuthenticationResponseCode> {
		return signInWithGoogleIdToken(token, deviceId, devicePlatform);
	}

	/**
	 * @experimental
	 */
	public register(
		email: string,
		password: string,
		name: string
	): Promise<RegistrationResponseCode> {
		return register(email, password, name);
	}

	/**
	 * @experimental
	 */
	public getUserInfo(): Promise<UserInfo> {
		return getUserInfo();
	}

	/**
	 * @experimental
	 */
	public signOut(): Promise<void> {
		return setSession(null);
	}

	/**
	 * @experimental
	 */
	public resetPassword(email: string): Promise<ResetPasswordResponseCode> {
		return resetPassword(email);
	}
}
