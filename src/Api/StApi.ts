import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getIntegratorKey, getStApiUrl } from '../Settings';
import { getUserSession } from '../User';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
	if (!config.baseURL) {
		throw new Error('API Url not set');
	}
	return config;
});

export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, await buildRequestConfig(url));
	return buildApiResponse(response);
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.post(url, requestData, await buildRequestConfig(url));
	return buildApiResponse(response);
}

export async function delete_(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.delete(url, await buildRequestConfig(url, requestData));
	return buildApiResponse(response);
}

export async function put(url: string, requestData): Promise<ApiResponse> {
	const response = await axiosInstance.put(url, requestData, await buildRequestConfig(url));
	return buildApiResponse(response);
}

async function buildRequestConfig(url: string, requestData?: any): Promise<AxiosRequestConfig> {
	console.log(url);
	console.trace();
	let baseUrl = getStApiUrl();

	if (url.indexOf('places/list') === -1) {
		baseUrl = baseUrl.replace('api-cdn', 'api');
	}

	const requestConfig: AxiosRequestConfig = {
		baseURL: baseUrl,
		headers: await buildHeaders()
	};

	if (requestData) {
		requestConfig.data = requestData;
	}
	return requestConfig;
}

async function buildHeaders(): Promise<any> {
	const userSession = await getUserSession();
	const headers = {};

	const clientKey = getIntegratorKey();

	if (clientKey) {
		headers['x-api-key'] = clientKey;
	}

	if (userSession) {
		headers['Authorization'] = 'Bearer ' + userSession.accessToken;
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
