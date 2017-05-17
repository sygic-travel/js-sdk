import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAccessToken, getApiKey, getApiUrl, getClientKey } from '../Settings';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
	if (!config.baseURL) {
		throw new Error('API Url not set');
	}
	return config;
});

export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, buildRequestConfig(url));
	return buildApiResponse(response);
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.post(url, requestData, buildRequestConfig(url));
	return buildApiResponse(response);
}

export async function delete_(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.delete(url, buildRequestConfig(url, requestData));
	return buildApiResponse(response);
}

function buildRequestConfig(url: string, requestData?: any): AxiosRequestConfig {
	const requestConfig: AxiosRequestConfig = {
		baseURL: buildBaseUrl(url),
		headers: buildHeaders()
	};

	if (requestData) {
		requestConfig.data = requestData;
	}
	return requestConfig;
}

function buildBaseUrl(url: string): string {
	let baseUrl: string = getApiUrl();
	const apiKey: string | null = getApiKey();

	if (apiKey && url.indexOf('places') < 0) {
		baseUrl = baseUrl + apiKey;
	}
	return baseUrl;
}

function buildHeaders() {
	const accessToken = getAccessToken();
	const headers = {};

	const clientKey = getClientKey();

	if (clientKey) {
		headers['x-api-key'] = clientKey;
	}

	if (accessToken) {
		headers['Authorization'] = 'Bearer ' + accessToken;
	}

	return headers;
}

function buildApiResponse(response: AxiosResponse): ApiResponse {
	return new ApiResponse(
		response.data.status_code,
		response.data.data
	);
}
