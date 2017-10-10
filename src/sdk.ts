import { Settings } from './Settings';
import StSDK from './StSDK';

export function create(settings: Settings): StSDK {
	return new StSDK(settings);
}
