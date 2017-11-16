import { ApiResponse, StApi } from '../Api';
import { Bounds } from '../Geo';
import { StaticMap, StaticMapPoint } from './PdfData';

export async function getStaticMap(
	id: string,
	width: number,
	height: number,
	points: StaticMapPoint[],
	bounds: Bounds
): Promise<StaticMap> {
	const apiResponse: ApiResponse = await StApi.post('static-maps', { width, height, points, bounds });

	if (!apiResponse.data.hasOwnProperty('url') || !apiResponse.data.hasOwnProperty('bounds')) {
		throw new Error('Wrong API response');
	}

	return mapStaticMapApiResponseToStaticMapDefinition(id, apiResponse.data);
}

function mapStaticMapApiResponseToStaticMapDefinition(id: string, data: any): StaticMap {
	return {
		id,
		url: data.url,
		bounds: data.bounds,
		sectors: []
	};
}
