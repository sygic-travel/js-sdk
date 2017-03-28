import SdkPublic from './SdkPublic';

export function create(apiUrl: string, clientKey: string) {
	return new SdkPublic(apiUrl, clientKey);
}
