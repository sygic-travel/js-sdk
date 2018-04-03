import * as Dao from './DataAccess';

export interface ExchangeRate {
	code: string;
	rate: number;
}

export const getExchangeRates = (): Promise<ExchangeRate[]> => Dao.getExchangeRates();
