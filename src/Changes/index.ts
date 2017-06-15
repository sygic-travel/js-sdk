import { handleTripChanges } from '../Trip';
import { ChangeNotification } from './ChangeNotification';
import ChangeWatcher from './ChangeWatcher';

export { ChangeNotification } from './ChangeNotification';

let changeWatcher: ChangeWatcher;
let externalCallback: (changeNotifications: ChangeNotification[]) => any | null;

export async function initializeChangesWatching(tickInterval: number): Promise<void> {
	changeWatcher = new ChangeWatcher(tickInterval, handleChanges);
	await changeWatcher.start();
}

export function stopChangesWatching(): void {
	if (changeWatcher) {
		changeWatcher.kill();
	}
}

export function setChangesCallback(callback: (changeNotifications: ChangeNotification[]) => any | null): void {
	externalCallback = callback;
}

async function handleChanges(changeNotifications: ChangeNotification[]): Promise<void> {
	await handleTripChanges(changeNotifications.filter((changeNotification: ChangeNotification) => {
		return changeNotification.type === 'trip';
	}));
	if (externalCallback) {
		externalCallback(changeNotifications);
	}
}
