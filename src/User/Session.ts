import { listToEnum } from '../Util';

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

const authenticationResponseCodeValues = listToEnum([
	'OK',
	'ERROR_INVALID_CREDENTIALS',
	'ERROR',
]);
export type AuthenticationResponseCode = keyof typeof authenticationResponseCodeValues;

const registrationResponseCodeValues = listToEnum([
	'OK',
	'ERROR_ALREADY_REGISTERED',
	'ERROR_EMAIL_INVALID_FORMAT',
	'ERROR_PASSWORD_MIN_LENGTH',
	'ERROR',
]);
export type RegistrationResponseCode = keyof typeof registrationResponseCodeValues;
