import { Event, EventType } from './Event';

import { StApi } from '../Api';
import { ChangeNotification, setChangesCallback } from '../Changes';
import { setTripConflictHandler } from '../Settings';
import { Trip, TripConflictClientResolution, TripConflictInfo } from '../Trip';
import { setSession } from '../User';

export { Event };

let externalEventHandler: (event: Event) => any;

export function setEventsHandler(handler: (event: Event) => any): void {
	externalEventHandler = handler;
}

export function initalize(): void {
	setChangesCallback(handleUserDataChanges);
	setTripConflictHandler(handleTripConflict);
	StApi.setInvalidSessionHandler(handleInvalidSession);
}

function handleUserDataChanges(changes: ChangeNotification[]): void {
	if (!externalEventHandler) {
		return;
	}

	const event: Event = {
		type: EventType.USER_DATA_CHANGES,
		payload: changes
	};

	externalEventHandler(event);
}

async function handleTripConflict(conflictInfo: TripConflictInfo, trip: Trip): Promise<TripConflictClientResolution> {
	if (!externalEventHandler) {
		return TripConflictClientResolution.server;
	}

	const event: Event = {
		type: EventType.TRIP_CONFLICT,
		payload: {
			conflictInfo,
			trip
		}
	};

	const conflictResolution = externalEventHandler(event);
	if (!conflictResolution) {
		return TripConflictClientResolution.server;
	}
	return conflictResolution;
}

async function handleInvalidSession(): Promise<void> {
	const event: Event = {
		type: EventType.INVALID_SESSION,
		payload: null
	};

	await setSession(null);

	if (externalEventHandler) {
		externalEventHandler(event);
	}
}
