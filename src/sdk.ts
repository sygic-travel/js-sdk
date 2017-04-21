import SdkBrowser from './SdkBrowser';

export function create(apiUrl: string, clientKey: string): SdkBrowser {
	return new SdkBrowser(apiUrl, clientKey);
}
