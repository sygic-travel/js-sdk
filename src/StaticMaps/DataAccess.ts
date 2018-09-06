import { ApiResponse, StApi } from '../Api';

export const getTripStaticMapUrl = (
	tripId: string,
	width: number,
	height: number
): Promise<string> => (
	getStaticMapUrl({
		height,
		width,
		trip_id: tripId,
		day_index: null
	})
);

export const getTripDayStaticMapUrl = (
	tripId: string,
	dayIndex: number,
	width: number,
	height: number,
): Promise<string> => (
	getStaticMapUrl({
		height,
		width,
		trip_id: tripId,
		day_index: dayIndex
	})
);

const getStaticMapUrl = async (requestData: any): Promise<string> => {
	const apiResponse: ApiResponse = await StApi.post(`static-maps/trips`, requestData);
	if (!apiResponse.data.hasOwnProperty('url')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.url as string;
};
