import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from '../Session';
import { getIntegratorKey, getStApiUrl } from '../Settings';
import { ApiResponse } from './ApiResponse';

export const axiosInstance: AxiosInstance = axios.create();

export enum CommonResponseCode {
	OK,
	NOT_FOUND,
	ERROR
}

const enum HttpMethod {
	GET,
	POST,
	PUT,
	DELETE,
}

const authorizationFreeEndpoints: any = {};
authorizationFreeEndpoints[HttpMethod.GET] = [
	'places',
	'directions',
	'tours',
	'hotels',
	'geoip',
	'translations',
	'exchange-rates',
	'tags'
];

const authorizationRequiredEndpoints: any = {};
authorizationRequiredEndpoints[HttpMethod.GET] = [
	'reviews'
];

const noCdnRequiredEndpoints: any = {};
noCdnRequiredEndpoints[HttpMethod.GET] = [
	'reviews'
];

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
		const response = await axiosInstance.get(url, await buildRequestConfig(url, HttpMethod.GET));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function post(url: string, requestData): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.post(url, requestData, await buildRequestConfig(url,  HttpMethod.POST));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function postMultipartJsonImage(
	url: string,
	jsonData,
	imageMimeType: string,
	imageData: string
): Promise<ApiResponse> {
	try {
		let data: string = '--BOUNDARY\n';
		data += 'Content-Disposition: form-data; name="data"\n';
		data += 'Content-Type: application/json\n\n';
		data += JSON.stringify(jsonData);
		data += '\n--BOUNDARY\n';
		data += 'Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\n';
		data += 'Content-Type: ' + imageMimeType + '\n\n';
		data += imageData;
		data += '\n--BOUNDARY--';

		const config: AxiosRequestConfig = await buildRequestConfig(url, HttpMethod.POST);
		config.headers['Content-Type'] = 'multipart/form-data; boundary=BOUNDARY';

		const response = await axiosInstance.post(url, data, config);
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function delete_(url: string, requestData?): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.delete(url, await buildRequestConfig(url, HttpMethod.DELETE, requestData));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

export async function put(url: string, requestData): Promise<ApiResponse> {
	try {
		const response = await axiosInstance.put(url, requestData, await buildRequestConfig(url, HttpMethod.PUT));
		return buildApiResponse(response);
	} catch (e) {
		throw handleError(e);
	}
}

async function buildRequestConfig(url: string, method: HttpMethod, requestData?: any): Promise<AxiosRequestConfig> {
	let baseUrl = getStApiUrl();

	if (
		url.indexOf('places') === -1 ||
		method !== HttpMethod.GET ||
		noCdnRequiredEndpoints[method] && noCdnRequiredEndpoints[method].find((slug: string) => url.includes(slug))
	) {
		baseUrl = baseUrl.replace('api-cdn', 'api');
	}

	const requestConfig: AxiosRequestConfig = {
		baseURL: baseUrl,
		headers: await buildHeaders(url, method)
	};

	if (requestData) {
		requestConfig.data = requestData;
	}
	return requestConfig;
}

async function buildHeaders(url: string, method: HttpMethod): Promise<any> {
	const headers = {};

	const clientKey = getIntegratorKey();

	if (clientKey) {
		headers['x-api-key'] = clientKey;
	}

	if (authorizationFreeEndpoints[method] &&
		authorizationFreeEndpoints[method].find((slug: string) => url.includes(slug)) &&
		!authorizationRequiredEndpoints[method].find((slug: string) => url.includes(slug))
	) {
		return headers;
	}

	const userSession = await getSession();
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
		e.response.data.error &&
		e.response.data.error.id &&
		e.response.data.error.id === 'apikey.invalid'
	) {
		if (invalidSessionHandler) {
			invalidSessionHandler();
		}
		return new Error('Invalid session');
	}
	return e;
}
