import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSsoApiUrl, getSsoClientId } from '../Settings';
import { Session } from '../User/Session';
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

export async function post(url: string, requestData, session?: Session): Promise<ApiResponse> {
	if (requestData && !requestData.client_id) {
		requestData.client_id = getSsoClientId();
	}
	const response = await axiosInstance.post(url, requestData, buildRequestConfig(session));
	return buildApiResponse(response);
}

function buildRequestConfig(session?: Session): AxiosRequestConfig {
	const config: AxiosRequestConfig = {
		baseURL: getSsoApiUrl(),
		headers: {
			'Content-Type': 'application/json'
		}
	};
	if (session) {
		config.headers['Authorization'] =  `Bearer ${session.accessToken}`;
	}
	return config;
}

function buildApiResponse(response: AxiosResponse): ApiResponse {
	return new ApiResponse(
		200,
		response.data
	);
}
