import { initializeChangesWatching, stopChangesWatching } from '../Changes';

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
}
