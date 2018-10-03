import { camelizeKeys } from 'humps';

import { Event } from './Event';

export const mapEventApiResponseToEvent = (eventFromApi: any): Event => camelizeKeys(eventFromApi) as Event;
