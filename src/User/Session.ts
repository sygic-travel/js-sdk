export interface Session {
	accessToken: string;
	refreshToken: string;
}

let userSession: Session|null = null;
let clientSession: Session|null = null;

export function getUserSession(): Session|null {
	return userSession;
}

export function setUserSession(session: Session|null): void {
	userSession = session;
}

export function getClientSession(): Session|null {
	return clientSession;
}

export function setClientSession(session: Session|null): void {
	clientSession = session;
}
