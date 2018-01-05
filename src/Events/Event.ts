import { listToEnum } from '../Util';

const eventTypesValues = listToEnum([
	'user_data_changes',
	'trip_conflict',
	'invalid_session',
]);

export type EventType = keyof typeof eventTypesValues;

export interface Event {
	type: EventType;
	payload: any;
}
