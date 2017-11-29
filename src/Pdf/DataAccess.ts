import { ApiResponse, StApi } from '../Api';
import { Bounds, calculateLocationsBounds } from '../Geo';
import { StaticMap, StaticMapPoint } from './PdfData';

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
