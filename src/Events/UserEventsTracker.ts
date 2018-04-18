import { StTrackingApi } from '../Api';
import { sendUserEvents } from './DataAccess';
import { UserEvent } from './UserEvent';

const EMPTY_EVENTS_BUFFER_INTERVAL = 20000;

export default class UserEventsTracker {
	private emptyUserEventsBufferInterval: number;
	private userEventsBuffer: UserEvent[];

	constructor() {
		this.emptyUserEventsBufferInterval = EMPTY_EVENTS_BUFFER_INTERVAL;
		this.userEventsBuffer = [];
	}

	public startTracking(): void {
		setInterval(() => this.emptyEventsBuffer(), this.emptyUserEventsBufferInterval);
	}

	public trackEvent(event: UserEvent): void {
		this.userEventsBuffer.push(event);
		if (this.userEventsBuffer.length > 4) {
			this.emptyEventsBuffer();
		}
	}

	private async emptyEventsBuffer(): Promise<void> {
		if (this.userEventsBuffer.length === 0) {
			return;
		}

		const response: StTrackingApi.StTrackingApiResponseCode = await sendUserEvents(this.userEventsBuffer);
		if (response === StTrackingApi.StTrackingApiResponseCode.OK) {
			this.userEventsBuffer = [];
		}
	}
}
