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
	const response = await axiosInstance.get(decorateUrl(url, 'GET'), buildRequestConfig());
	return buildApiResponse(response);
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.post(decorateUrl(url, 'POST'), requestData, buildRequestConfig());
	return buildApiResponse(response);
}

export async function delete_(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.delete(decorateUrl(url, 'DELETE'), buildRequestConfig(requestData));
	return buildApiResponse(response);
}

export async function put(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.put(decorateUrl(url, 'PUT'), requestData, buildRequestConfig());
	return buildApiResponse(response);
}

function buildRequestConfig(requestData?: any): AxiosRequestConfig {
	const requestConfig: AxiosRequestConfig = {
		baseURL: getApiUrl(),
		headers: buildHeaders()
	};

	if (requestData) {
		requestConfig.data = requestData;
	}
	return requestConfig;
}

function decorateUrl(url: string, method: string): string {
	const apiKey: string | null = getApiKey();
	if (!apiKey || (url.indexOf('places') > -1 && method === 'GET')) {
		return url;
	}

	if (url.indexOf('?') > -1) {
		return url + '&api_key=' + apiKey;
	} else {
		return url + '?api_key=' + apiKey;
	}
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
		response.data.data,
		response.data.server_timestamp
	);
}
