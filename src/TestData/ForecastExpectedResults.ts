import { Forecast, ForecastTemperature, ForecastWeather } from '../Forecast';

export const forecasts = [{
	date: '2017-06-08T11:00:00+00:00',
	temp: {
		min: 11.42,
		max: 21.88
	} as ForecastTemperature,
	weather: {
		id: 801,
		name: 'Clouds',
		description: 'few clouds',
		iconId: '02d'
	} as ForecastWeather,
	sunrise: '2017-06-08T04:51:00+02:00',
	sunset: '2017-06-08T21:11:00+02:00'
} as Forecast, {
	date: '2017-06-09T11:00:00+00:00',
	temp: {
		min: 14.4,
		max: 24.9
	} as ForecastTemperature,
	weather: {
		id: 500,
		name: 'Rain',
		description: 'light rain',
		iconId: '10d'
	} as ForecastWeather,
	sunrise: '2017-06-09T04:50:00+02:00',
	sunset: '2017-06-09T21:12:00+02:00'
} as Forecast];
