import { ChangeNotification } from '../Changes';
import {
	setSessionExpiredHandler,
	setSynchronizationHandler,
	setTripUpdateConflictHandler,
	trackUserEvent
} from '../Events';
import { UserEvent } from '../Events/UserEvent';
import { Trip, TripConflictInfo } from '../Trip';

/**
 * @experimental
 */
export default class EventsModule {
	public setSessionExpiredHandler(handler: () => any): void {
		setSessionExpiredHandler(handler);
	}

	public setTripUpdateConflictHandler(handler: (conflictInfo: TripConflictInfo, trip: Trip) => any): void {
		setTripUpdateConflictHandler(handler);
	}

	public setSynchronizationHandler(handler: (changes: ChangeNotification[]) => any): void {
		setSynchronizationHandler(handler);
	}

	public trackUserEvent(userEvent: UserEvent): void {
		trackUserEvent(userEvent);
	}
}
