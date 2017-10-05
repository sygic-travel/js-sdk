export interface Session {
	accessToken: string;
	refreshToken: string;
}

let userSession: Session|null = null;

export function getUserSession(): Session|null {
	return userSession;
}

export function setUserSession(session: Session|null): void {
	userSession = session;
}
}
