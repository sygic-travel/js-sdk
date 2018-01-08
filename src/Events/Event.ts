export enum EventType {
	USER_DATA_CHANGES = 'user_data_changes',
	TRIP_CONFLICT = 'trip_conflict',
	INVALID_SESSION = 'invalid_session',
}

export interface Event {
	type: EventType;
	payload: any;
}
