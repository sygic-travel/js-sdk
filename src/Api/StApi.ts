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

let invalidSessionHandler: () => any;

export function setInvalidSessionHandler(handler: () => any): void {
	invalidSessionHandler = handler;
}

export async function get(url: string): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.get(url, await buildRequestConfig(url));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.post(url, requestData, await buildRequestConfig(url));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function delete_(url: string, requestData): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.delete(url, await buildRequestConfig(url, requestData));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function put(url: string, requestData): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.put(url, requestData, await buildRequestConfig(url));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

async function buildRequestConfig(url: string, requestData?: any): Promise<AxiosRequestConfig> {
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

function handleError(e: any): Error {
	if (e.response &&
		e.response.data &&
		e.response.data.data &&
		e.response.data.data.error &&
		e.response.data.data.error.id &&
		e.response.data.data.error.id === 'apikey.invalid'
	) {
		if (invalidSessionHandler) {
			invalidSessionHandler();
		}
		return new Error('Invalid session');
	}
	return e;
}
