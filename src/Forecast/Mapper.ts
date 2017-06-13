import { camelizeKeys } from 'humps';

import { Forecast } from './Forecast';

export function mapForecastsApiResponseToForecasts(forecasts: any): Forecast[] {
	return forecasts.map((forecast): Forecast => camelizeKeys(forecast) as Forecast);
}
