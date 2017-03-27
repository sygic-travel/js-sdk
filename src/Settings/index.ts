let apiUrl = null;
let clientKey = null;

export function setEnvironment(url: string, key: string): void {
	apiUrl = url;
	clientKey = key;
}

export function getApiUrl() {
	return apiUrl;
}

export function getClientKey() {
	return clientKey;
}
