import StSDK from './StSDK';

export function create(apiUrl: string, clientKey: string): StSDK {
	return new StSDK(apiUrl, clientKey);
}
