import { setEnvironment } from './Settings';

export abstract class BaseSDK {
	constructor(apiUrl: string, clientKey: string) {
		setEnvironment(apiUrl, clientKey);
	}
}
