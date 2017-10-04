import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSsoApiUrl, getSsoClientId } from '../Settings';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
	if (!config.baseURL) {
		throw new Error('API Url not set');
	}
	return config;
});

export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, buildRequestConfig());
	return buildApiResponse(response);
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	if (requestData && !requestData.client_id) {
		requestData.client_id = getSsoClientId();
	}
	const response = await axiosInstance.post(url, requestData, buildRequestConfig());
	return buildApiResponse(response);
}

function buildRequestConfig(): AxiosRequestConfig {
	return {
		baseURL: getSsoApiUrl(),
		headers: {'content-type': 'application/json'}
	} as AxiosRequestConfig;
}

function buildApiResponse(response: AxiosResponse): ApiResponse {
	return new ApiResponse(
		200,
		response.data
	);
}
