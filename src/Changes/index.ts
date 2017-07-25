import { handleFavoritesChanges } from '../Favorites';
import { handleTripChanges } from '../Trip';
import { handleSettingsChange } from '../User';
import { ChangeNotification } from './ChangeNotification';
import ChangeWatcher from './ChangeWatcher';

export { ChangeNotification } from './ChangeNotification';

let changeWatcher: ChangeWatcher | null;
let externalCallback: (changeNotifications: ChangeNotification[]) => any | null;
const DEFAULT_TICK_INTERVAL = 60000;
const MINIMAL_TICK_INTERVAL = 5000;

export async function initializeChangesWatching(tickInterval?: number): Promise<void> {
	if (!tickInterval) {
		tickInterval = DEFAULT_TICK_INTERVAL;
	}
	if (tickInterval < MINIMAL_TICK_INTERVAL) {
		throw new Error('Sync changes from server interval must be greater then ' + MINIMAL_TICK_INTERVAL + 'ms.');
	}
	if (!changeWatcher) {
		changeWatcher = new ChangeWatcher(tickInterval, handleChanges);
	}

	await changeWatcher.start();
}

export function stopChangesWatching(): void {
	if (changeWatcher) {
		changeWatcher.kill();
		changeWatcher = null;
	}
}

export function setChangesCallback(callback: (changeNotifications: ChangeNotification[]) => any | null): void {
	externalCallback = callback;
}

export function reset() {
	if (changeWatcher) {
		changeWatcher.reset();
	}
}

async function handleChanges(changeNotifications: ChangeNotification[]): Promise<void> {
	let relevantChanges: ChangeNotification[] = [];

	const settingsChange = changeNotifications.find((change) => (change.type === 'settings'));
	if (settingsChange) {
		relevantChanges.push(settingsChange);
		handleSettingsChange();
	}

	relevantChanges = relevantChanges.concat(await handleTripChanges(
		changeNotifications.filter((changeNotification: ChangeNotification) => {
			return changeNotification.type === 'trip';
		})
	));

	relevantChanges = relevantChanges.concat(await handleFavoritesChanges(
		changeNotifications.filter((changeNotification: ChangeNotification) => {
			return changeNotification.type === 'favorite';
		})
	));

	if (externalCallback && relevantChanges.length > 0) {
		externalCallback(relevantChanges);
	}
}
