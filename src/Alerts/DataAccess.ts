import { stringify } from 'query-string';
import { ApiResponse, StApi } from '../Api';
import { Alert } from './Alert';
import { AlertsQuery } from './AlertsQuery';
import { mapAlertsApiResponseToAlerts } from './Mapper';

const DEFAULT_QUERY_LIMIT = 100;

export const getAlerts = async (alertsQuery: AlertsQuery): Promise<Alert[]> => {
	const query: any = {
		from: alertsQuery.from,
		to: alertsQuery.to,
		limit: DEFAULT_QUERY_LIMIT
	};

	if (alertsQuery.types && alertsQuery.types.length > 0) {
		query.type = alertsQuery.types.join('|');
	}

	if (alertsQuery.severities && alertsQuery.severities.length > 0) {
		query.severity = alertsQuery.severities.join('|');
	}

	if (alertsQuery.placeIds && alertsQuery.placeIds.length > 0) {
		query.place_ids = alertsQuery.placeIds.join('|');
	}

	if (alertsQuery.limit) {
		query.limit = alertsQuery.limit;
	}

	const apiResponse: ApiResponse = await StApi.get('alerts/list?' + stringify(query));

	if (!apiResponse.data.hasOwnProperty('alerts')) {
		throw new Error('Wrong API response');
	}

	return mapAlertsApiResponseToAlerts(apiResponse.data.alerts);
};
