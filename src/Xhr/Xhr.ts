import axios, {AxiosInstance} from 'axios';
import {ApiResponse} from "./ApiResponse";
import Settings from "../Settings";

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
	if (!config.baseURL) {
		throw 'API Url not set';
	}

	if (!config.headers['x-api-key']) {
		throw 'Client key not set';
	}

	return config;
});

export function get(url: string): Promise<ApiResponse> {
	return axiosInstance.get(url, {
		baseURL: Settings.getApiUrl(),
		headers: {
			'x-api-key': Settings.getClientKey()
		}
	})
	.then((result) => {
		return new ApiResponse(
			result.data.status,
			result.data.status_code,
			result.data.status_message,
			result.data.data
		);
	})
}



