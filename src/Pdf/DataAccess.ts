import { camelizeKeys } from 'humps';
import { ApiResponse, StApi } from '../Api';
import { Bounds, calculateLocationsBounds } from '../Geo';
import { GeneratingState, StaticMap, StaticMapPoint } from './PdfData';

export async function getStaticMap(
	width: number,
	height: number,
	points: StaticMapPoint[],
): Promise<StaticMap> {
	const bounds: Bounds = calculateLocationsBounds(points);
	const apiResponse: ApiResponse = await StApi.post('static-maps', { width, height, points, bounds });

	if (!apiResponse.data.hasOwnProperty('url') || !apiResponse.data.hasOwnProperty('bounds')) {
		throw new Error('Wrong API response');
	}

	return {
		url: apiResponse.data.url as string,
		bounds: apiResponse.data.bounds as Bounds
	};
}

export async function generatePdf(tripId: string): Promise<GeneratingState> {

	const apiResponse: ApiResponse = await StApi.post('trips/' + tripId + '/pdf', {});

	if (!apiResponse.data.hasOwnProperty('pdf')) {
		throw new Error('Wrong API response');
	}

	return camelizeKeys(apiResponse.data.pdf) as GeneratingState;
}

export async function getGeneratingState(tripId: string, generatingId: string): Promise<GeneratingState> {

	const apiResponse: ApiResponse = await StApi.get('trips/' + tripId + '/pdf?generating_id=' + generatingId);

	if (!apiResponse.data.hasOwnProperty('pdf')) {
		throw new Error('Wrong API response');
	}

	return camelizeKeys(apiResponse.data.pdf) as GeneratingState;
}
