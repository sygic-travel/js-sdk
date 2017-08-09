import { ChangeNotification, initializeChangesWatching, setChangesCallback, stopChangesWatching } from '../Changes';

/**
 * @experimental
 */
export default class ChangesModule {
	public initializeChangesWatching(tickInterval: number): Promise<void> {
		return initializeChangesWatching(tickInterval);
	}

	public stopChangesWatching(): void {
		return stopChangesWatching();
	}

	public setChangesCallback(callback: (changeNotifications: ChangeNotification[]) => any | null): void {
		setChangesCallback(callback);
	}
}
