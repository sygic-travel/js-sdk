import axios, {AxiosInstance} from 'axios';
import { getAccessToken, getApiKey, getApiUrl, getClientKey } from '../Settings';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
	if (!config.baseURL) {
		throw new Error('API Url not set');
	}
	return config;
});

export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, {
		baseURL: buildBaseUrl(),
		headers: buildHeaders()
	});

	return new ApiResponse(
		response.data.status,
		response.data.status_code,
		response.data.status_message,
		response.data.data
	);
}

function buildBaseUrl(): string {
	let baseUrl: string = getApiUrl();
	const apiKey: string | null = getApiKey();
	if (apiKey) {
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
