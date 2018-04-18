import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getStTrackingApiUrl } from '../Settings';

export enum StTrackingApiResponseCode {
	OK,
	ERROR
}

export const axiosInstance: AxiosInstance = axios.create();

export const post = async (url: string, requestData: any): Promise<StTrackingApiResponseCode> => {
	const response: AxiosResponse = await axiosInstance.post(url, requestData, buildRequestConfig());
	return response.status === 200 ? StTrackingApiResponseCode.OK : StTrackingApiResponseCode.ERROR;
};

export const buildRequestConfig = (): AxiosRequestConfig => ({
	baseURL: getStTrackingApiUrl(),
	headers: {
		'Content-Type': 'application/json'
	}
});
