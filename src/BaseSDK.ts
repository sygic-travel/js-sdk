import { setEnvironment, Settings } from './Settings';

export abstract class BaseSDK {
	constructor(settings: Settings) {
		setEnvironment(settings);
	}
}
