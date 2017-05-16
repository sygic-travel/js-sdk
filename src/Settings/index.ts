let apiUrl: string;
let clientKey: string;

let apiKey: string | null;
let accessToken: string | null;

export function setEnvironment(url: string, key: string): void {
	apiUrl = url;
	clientKey = key;
}

export function setUserSession(key: string | null, token: string | null): void {
	if (key && token) {
		throw Error('Can\'t set session with both key and token.');
	} else {
		apiKey = key;
		accessToken = token;
	}
}

export function getApiUrl() {
	return apiUrl;
}

export function getClientKey() {
	return clientKey;
}

export function getApiKey() {
	return apiKey;
}

export function getAccessToken() {
	return accessToken;
}
