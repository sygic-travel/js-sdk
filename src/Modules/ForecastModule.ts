import { Forecast, getDestinationWeather } from '../Forecast';

/**
 * @experimental
 */
export default class ForecastModule {
	public getDestinationWeather(destinationId: string): Promise<Forecast[]> {
		return getDestinationWeather(destinationId);
	}
}
