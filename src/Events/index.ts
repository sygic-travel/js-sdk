import { StApi } from '../Api';
import { ChangeNotification, setChangesCallback } from '../Changes';
import { setSession } from '../Session';
import { getStTrackingApiUrl, setTripConflictHandler } from '../Settings';
import { Trip, TripConflictClientResolution, TripConflictInfo } from '../Trip';
import { UserEvent } from './UserEvent';
import UserEventsTracker from './UserEventsTracker';

let synchronizationHandler: (changes: ChangeNotification[]) => any;
let tripUpdateConflictHandler: (conflictInfo: TripConflictInfo, trip: Trip) => any;
let sessionExpiredHandler: () => any;
let userEventsTracker: UserEventsTracker | null = null;

export function setSynchronizationHandler(handler: (changes: ChangeNotification[]) => any): void {
	synchronizationHandler = handler;
}

export function setTripUpdateConflictHandler(handler: (conflictInfo: TripConflictInfo, trip: Trip) => any): void {
	tripUpdateConflictHandler = handler;
}

export function setSessionExpiredHandler(handler: () => any): void {
	sessionExpiredHandler = handler;
}

export function initialize(): void {
	setChangesCallback(handleUserDataChanges);
	setTripConflictHandler(handleTripConflict);
	StApi.setInvalidSessionHandler(handleInvalidSession);

	if (getStTrackingApiUrl()) {
		userEventsTracker = new UserEventsTracker();
		userEventsTracker.startTracking();
	}
}

function handleUserDataChanges(changes: ChangeNotification[]): void {
	if (!synchronizationHandler) {
		return;
	}

	synchronizationHandler(changes);
}

async function handleTripConflict(conflictInfo: TripConflictInfo, trip: Trip): Promise<TripConflictClientResolution> {
	if (!tripUpdateConflictHandler) {
		return TripConflictClientResolution.SERVER;
	}

	const conflictResolution = tripUpdateConflictHandler(conflictInfo, trip);
	if (!conflictResolution) {
		return TripConflictClientResolution.SERVER;
	}
	return conflictResolution;
}

async function handleInvalidSession(): Promise<void> {
	await setSession(null);

	if (sessionExpiredHandler) {
		sessionExpiredHandler();
	}
}

export function trackUserEvent(event: UserEvent): void {
	if (!userEventsTracker) {
		throw new Error('Events tracking not initialized');
	}
	userEventsTracker.trackEvent(event);
}
