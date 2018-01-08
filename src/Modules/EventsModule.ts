import { Event, setEventsHandler } from '../Events';

/**
 * @experimental
 */
export default class EventsModule {
	public setEventsHandler(handler: (event: Event) => any): void {
		setEventsHandler(handler);
	}
}
