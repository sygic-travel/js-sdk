import { initalize as initializeEventHandling } from './Events';
import { Settings } from './Settings';
import StSDK from './StSDK';

export function create(settings: Settings): StSDK {
	initializeEventHandling();
	return new StSDK(settings);
}
