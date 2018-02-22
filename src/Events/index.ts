import { StApi } from '../Api';
import { ChangeNotification, setChangesCallback } from '../Changes';
import { setSession } from '../Session';
import { setTripConflictHandler } from '../Settings';
import { Trip, TripConflictClientResolution, TripConflictInfo } from '../Trip';

let synchronizationHandler: (changes: ChangeNotification[]) => any;
let tripUpdateConflictHandler: (conflictInfo: TripConflictInfo, trip: Trip) => any;
let sessionExpiredHandler: () => any;

export function setSynchronizationHandler(handler: (changes: ChangeNotification[]) => any): void {
	synchronizationHandler = handler;
}

export function setTripUpdateConflictHandler(handler: (conflictInfo: TripConflictInfo, trip: Trip) => any): void {
	tripUpdateConflictHandler = handler;
}

export function setSessionExpiredHandler(handler: () => any): void {
	sessionExpiredHandler = handler;
}

export function initalize(): void {
	setChangesCallback(handleUserDataChanges);
	setTripConflictHandler(handleTripConflict);
	StApi.setInvalidSessionHandler(handleInvalidSession);
}

function handleUserDataChanges(changes: ChangeNotification[]): void {
	if (!synchronizationHandler) {
		return;
	}

	synchronizationHandler(changes);
}

async function handleTripConflict(conflictInfo: TripConflictInfo, trip: Trip): Promise<TripConflictClientResolution> {
	if (!tripUpdateConflictHandler) {
		return TripConflictClientResolution.server;
	}

	const conflictResolution = tripUpdateConflictHandler(conflictInfo, trip);
	if (!conflictResolution) {
		return TripConflictClientResolution.server;
	}
	return conflictResolution;
}

async function handleInvalidSession(): Promise<void> {
	await setSession(null);

	if (sessionExpiredHandler) {
		sessionExpiredHandler();
	}
}
