import { stringify } from 'query-string';

import { ApiResponse, StApi } from '../Api';
import { getSession, Session } from '../Session';
import { ChangeNotification } from './ChangeNotification';

export default class ChangeWatcher {
	private changeWatchTicker;
	private tickInterval: number;
	private callback: (changeNotifications: ChangeNotification[]) => any;
	private lastServerTimestamp: string | null;

	constructor(tickInterval: number, callback: (changeNotifications: ChangeNotification[]) => any) {
		this.tickInterval = tickInterval;
		this.callback = callback;
	}

	public async start(): Promise<void> {
		if (this.changeWatchTicker) {
			return;
		}
		await this.checkChanges();
		this.changeWatchTicker = setInterval(() => this.checkChanges(), this.tickInterval);
	}

	private async checkChanges(): Promise<void> {
		const session: Session | null = await getSession();
		if (!session) {
			return;
		}
		const changesNotifications: ChangeNotification[] = await this.getChangesFromApi();
		if (changesNotifications.length > 0) {
			await this.callback(changesNotifications);
		}
	}

	private async getChangesFromApi() {
		const changesNotifications: ChangeNotification[] = [];
		const queryString = this.lastServerTimestamp ? 'changes?' + stringify({
				since: this.lastServerTimestamp
			}) : 'changes';

		const apiResponse: ApiResponse = await StApi.get(queryString);
		if (apiResponse.serverTimestamp) {
			this.lastServerTimestamp = apiResponse.serverTimestamp;
		}

		if (!apiResponse.data.hasOwnProperty('changes')) {
			throw new Error('Changes error');
		}

		if (apiResponse.data.changes.length > 0) {
			apiResponse.data.changes.forEach((item) => {
				const change: ChangeNotification = {
					id: item.id,
					type: item.type,
					change: item.change,
				};
				if (item.version) {
					change.version = item.version;
				}
				changesNotifications.push(change);
			});
		}
		return changesNotifications;
	}

	public kill() {
		clearInterval(this.changeWatchTicker);
		this.changeWatchTicker = null;
	}

	public reset() {
		this.lastServerTimestamp = null;
	}
}
