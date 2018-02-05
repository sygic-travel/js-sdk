export interface Session {
	accessToken: string;
	refreshToken: string;
	expirationTimestamp: number;
	suggestedRefreshTimestamp: number;
}

export interface AuthResponse {
	code: AuthenticationResponseCode;
	session: Session | null;
}

export enum AuthenticationResponseCode {
	OK = 'OK',
	ERROR_INVALID_CREDENTIALS = 'ERROR_INVALID_CREDENTIALS',
	ERROR = 'ERROR'
}

export enum RegistrationResponseCode {
	OK = 'OK',
	ERROR_ALREADY_REGISTERED = 'ERROR_ALREADY_REGISTERED',
	ERROR_EMAIL_INVALID_FORMAT = 'ERROR_EMAIL_INVALID_FORMAT',
	ERROR_PASSWORD_MIN_LENGTH = 'ERROR_PASSWORD_MIN_LENGTH',
	ERROR = 'ERROR'
}
