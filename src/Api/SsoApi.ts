import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Session } from '../Session/Session';
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
	return buildOkApiResponse(response);
}

export async function post(url: string, requestData, session?: Session): Promise<ApiResponse> {
	if (requestData && !requestData.client_id) {
		requestData.client_id = getSsoClientId();
	}
	try {
		const response = await axiosInstance.post(url, requestData, buildRequestConfig(session));
		return buildOkApiResponse(response);
	} catch (e) {
		if (e.response && e.response.data && e.response.data.status) {
			return new ApiResponse(
				e.response.data.status,
				e.response.data
			);
		} else {
			return new ApiResponse(
				500,
				{type: 'error'}
			);
		}

	}
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

function buildOkApiResponse(response: AxiosResponse): ApiResponse {
	return new ApiResponse(
		200,
		response.data
	);
}
