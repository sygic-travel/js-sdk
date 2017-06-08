import { ApiResponse, get } from '../Xhr';
import { Forecast } from './Forecast';
import { mapForecastsApiResponseToForecasts } from './Mapper';

export async function getDestinationWeather(destinationId: string): Promise<Forecast[]> {
	const apiResponse: ApiResponse = await get(`places/${destinationId}/weather-forecast`);

	if (!apiResponse.data.hasOwnProperty('forecast')) {
		throw new Error('Wrong API response');
	}

	return mapForecastsApiResponseToForecasts(apiResponse.data.forecast);
}
