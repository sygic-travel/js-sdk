export interface Forecast {
	date: string;
	temp: ForecastTemperature;
	weather: ForecastWeather;
	sunrise: string;
	sunset: string;
}

export interface ForecastTemperature {
	min: number;
	max: number;
}

export interface ForecastWeather {
	id: number;
	name: string;
	description: string;
	iconId: string;
}
