import { stringify } from 'query-string';
import { ApiResponse, StApi } from '../Api';
import { alertsCache } from '../Cache';
import { areBoundsInsideBounds, Bounds } from '../Geo';
import { extendBounds, getGeoJsonAndBoundsIntersection } from '../Geo/Bounds';
import { Alert, DetailedAlert } from './Alert';
import { AlertsQuery } from './AlertsQuery';
import { mapAlertsApiResponseToAlerts, mapDetailedAlertApiResponseToDetailedAlert } from './Mapper';

const DEFAULT_QUERY_LIMIT: number = 100;
const DEFAULT_BOUNDS_EXPAND_SIZE: number = 500000;


export const getAlerts = async (alertsQuery: AlertsQuery): Promise<Alert[]> => {
	const queryStringObject: any = createGetAlertsQueryStringObject(alertsQuery);
	const filterQueryString: string = 'alerts/list?' + stringify(queryStringObject);

	if (!alertsQuery.bounds) {
		const apiResponseCalledWithoutBounds: ApiResponse = await getAlertsApiGetResponse(filterQueryString);
		return mapAlertsApiResponseToAlerts(apiResponseCalledWithoutBounds.data.alerts);
	}

	const filterQueryStringFromCache: string = await alertsCache.get('filterQuery') as string;
	const extendedBoundsFromCache: Bounds = await alertsCache.get('bounds') as Bounds;

	if (filterQueryString === filterQueryStringFromCache &&
		areBoundsInsideBounds(alertsQuery.bounds, extendedBoundsFromCache)) {
		const alerts: Alert[] = mapAlertsApiResponseToAlerts(await alertsCache.get('alerts'));
		return filterVisibleAlerts(alerts, alertsQuery.bounds);
	}

	const extendedBounds: Bounds = getExtendedBounds(alertsQuery.bounds);
	const queryStringObjectWithBounds: any = createGetAlertsQueryStringObject(alertsQuery, extendedBounds);
	const filterQueryStringWithBounds: string = 'alerts/list?' + stringify(queryStringObjectWithBounds);
	const apiResponseCalledWithBounds: ApiResponse = await getAlertsApiGetResponse(filterQueryStringWithBounds);

	alertsCache.set('filterQuery', filterQueryString);
	alertsCache.set('bounds', extendedBounds);
	alertsCache.set('alerts', apiResponseCalledWithBounds.data.alerts);

	return mapAlertsApiResponseToAlerts(apiResponseCalledWithBounds.data.alerts);
};

const getAlertsApiGetResponse = async (filterQueryString: string): Promise<ApiResponse> => {
	const apiResponse: ApiResponse = await StApi.get(filterQueryString);
	if (!apiResponse.data.hasOwnProperty('alerts')) {
		throw new Error('Wrong API response');
	}
	return apiResponse;
};

const filterVisibleAlerts = (alerts: Alert[], bounds: Bounds): Alert[] => (
	alerts.filter((alert: Alert) => getGeoJsonAndBoundsIntersection(alert.affectedArea, bounds))
);

const getExtendedBounds = (bounds: Bounds): Bounds => {
	return extendBounds(bounds, DEFAULT_BOUNDS_EXPAND_SIZE);
};

export const getDetailedAlerts = async (alertIds: string[]): Promise<DetailedAlert[]> => {
	return Promise.all(alertIds.map(async (alertId: string) => {
		const apiResponse: ApiResponse = await StApi.get('alerts/' + alertId);
		if (!apiResponse.data.hasOwnProperty('alert')) {
			throw new Error('Wrong API response');
		}
		return mapDetailedAlertApiResponseToDetailedAlert(apiResponse.data.alert);
	}));
};

const createGetAlertsQueryStringObject = (alertsQuery: AlertsQuery, bounds?: Bounds): any => {
	const query: any = {
		from: alertsQuery.from,
		to: alertsQuery.to,
		limit: DEFAULT_QUERY_LIMIT
	};

	if (alertsQuery.types && alertsQuery.types.length > 0) {
		query.types = alertsQuery.types.join('|');
	}

	if (alertsQuery.severities && alertsQuery.severities.length > 0) {
		query.severities = alertsQuery.severities.join('|');
	}

	if (alertsQuery.states && alertsQuery.states.length > 0) {
		query.states = alertsQuery.states.join('|');
	}

	if (alertsQuery.placeIds && alertsQuery.placeIds.length > 0) {
		query.place_ids = alertsQuery.placeIds.join('|');
	}

	if (alertsQuery.limit) {
		query.limit = alertsQuery.limit;
	}

	if (bounds) {
		query.bounds = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
	}

	return query;
};
