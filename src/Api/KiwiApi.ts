import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();
export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, buildRequestConfig());
	return buildApiResponse(response);
}

export const localeMap = {
	en: 'en-US',
	fr: 'fr-FR',
	nl: 'nl-NL',
	pt: 'pt-PT',
	it: 'it-IT',
	ru: 'ru-RU',
	sk: 'sk-SK',
	pl: 'pl-PL',
	tr: 'tr-TR',
	zh: 'zh-CN',
	cs: 'cs-CZ',
	de: 'de-DE',
	ko: 'ko-KR',
	es: 'es-ES',
};

function buildRequestConfig(): AxiosRequestConfig {
	return {
		headers: {
			'Content-Type': 'application/json'
		}
	} as AxiosRequestConfig;
}

function buildApiResponse(response: AxiosResponse): ApiResponse {
	return new ApiResponse(
		200,
		response.data
	);
}
