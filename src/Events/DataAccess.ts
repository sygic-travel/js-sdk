import { StTrackingApi } from '../Api';
import { UserEvent } from './UserEvent';

export async function sendUserEvents(eventsBuffer: UserEvent[]): Promise<StTrackingApi.StTrackingApiResponseCode> {
	return StTrackingApi.post('track', eventsBuffer);
}
