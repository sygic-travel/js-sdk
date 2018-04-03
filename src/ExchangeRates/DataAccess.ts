import { ExchangeRate } from '.';
import { ApiResponse, StApi } from '../Api';

export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
	const apiResponse: ApiResponse = await StApi.get(`exchange-rates`);
	if (!apiResponse.data.hasOwnProperty('exchange_rates')) {
		throw new Error('Wrong API response');
	}

	return apiResponse.data.exchange_rates.map((exchangeRate) => {
		return exchangeRate as ExchangeRate;
	});
};
