import * as Dao from './DataAccess';
import { Forecast, ForecastTemperature, ForecastWeather } from './Forecast';

export { Forecast, ForecastTemperature, ForecastWeather };

export async function getDestinationWeather(destinationId: string): Promise<Forecast[]> {
	return Dao.getDestinationWeather(destinationId);
}
