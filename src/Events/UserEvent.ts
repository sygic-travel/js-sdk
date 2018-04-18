export interface UserEvent {
	version: number;
	type: UserEventType;
	category: UserEventCategory;
	action: UserEventAction;
	platform: string;
	appVersion: string;
	sessionId: string;
	timestamp: number;
	label: string[];
	payload: any;
}

export enum UserEventType {
	Event = 'event'
}

export enum UserEventCategory {
	SEARCH = 'search',
	MAP = 'map',
	LIST = 'list',
	DETAIL = 'detail'
}

export enum UserEventAction {
	OPEN = 'open',
	CLOSE = 'close'
}
