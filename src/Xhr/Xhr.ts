import axios, {AxiosInstance} from 'axios';
import {ApiResponse} from "./ApiResponse";
import { getApiUrl, getClientKey } from "../Settings";

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



