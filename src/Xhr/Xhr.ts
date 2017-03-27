import axios, {AxiosInstance} from 'axios';
import { getApiUrl, getClientKey } from '../Settings';
import { ApiResponse } from './ApiResponse';

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
	if (!config.baseURL) {
		throw new Error('API Url not set');
	}

	if (!config.headers['x-api-key']) {
		throw new Error('Client key not set');
	}

	return config;
});

export async function get(url: string): Promise<ApiResponse> {
	const response = await axiosInstance.get(url, {
		baseURL: getApiUrl(),
		headers: {
			'x-api-key': getClientKey()
		}
	});

	return new ApiResponse(
		response.data.status,
		response.data.status_code,
		response.data.status_message,
		response.data.data
	);
}
