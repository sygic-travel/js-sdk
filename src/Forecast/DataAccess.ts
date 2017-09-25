import { ApiResponse, StApi } from '../Api';
import { Forecast } from './Forecast';
import { mapForecastsApiResponseToForecasts } from './Mapper';

export async function getDestinationWeather(destinationId: string): Promise<Forecast[]> {
	const apiResponse: ApiResponse = await StApi.get(`places/${destinationId}/weather-forecast`);

	if (!apiResponse.data.hasOwnProperty('forecast')) {
		throw new Error('Wrong API response');
	}

	return mapForecastsApiResponseToForecasts(apiResponse.data.forecast);
}
