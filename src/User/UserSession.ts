export interface UserSession {
	accessToken: string;
	refreshToken: string;
}

let session: UserSession|null = null;

export function getSession(): UserSession|null {
	return session;
}

export function setSession(userSession: UserSession|null): void {
	session = userSession;
}
