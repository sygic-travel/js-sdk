import SdkBrowser from './SdkBrowser';

export function create(apiUrl: string, clientKey: string) {
	return new SdkBrowser(apiUrl, clientKey);
}
