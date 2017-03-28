import { setEnvironment } from './Settings';

export abstract class SdkBase {
	constructor(apiUrl: string, clientKey: string) {
		setEnvironment(apiUrl, clientKey);
	}
}
