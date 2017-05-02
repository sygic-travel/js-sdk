let apiUrl: string;
let clientKey: string;

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
