import { decamelizeKeys } from 'humps';

import { DirectionSendResponseCode, Mapper, Route, RouteRequest } from '.';
import { ApiResponse, StApi } from '../Api';
import { routesCache as cache } from '../Cache';
import { NamedLocation } from '../Geo';
import { TransportAvoid, TransportMode } from '../Trip';
import { flatten, splitArrayToChunks } from '../Util';
import { estimateModeDirections } from './Estimator';
import { Waypoint } from './Route';

export async function getRoutes(requests: RouteRequest[]): Promise<Route[]> {
	const keys: string[] = requests.map(createCacheKey);
	const cached = await cache.getBatchMap(keys);
	const routesData: any[] = keys.map((key: string) => (cached.get(key)));
	const apiData =  await getFromApi(requests.filter((request: RouteRequest, index: number) => (!routesData[index])));
	return routesData.map((routeData: object | null) => {
		if (routeData === null) {
			return apiData.shift();
		}
		return routeData;
	}).map((routeData, index) => {
		const route: Route = Mapper.mapRouteFromApiResponse(
			routeData,
			requests[index].avoid
		);

		route.modeDirections = route.modeDirections.concat(
			estimateModeDirections(route.modeDirections, route.origin, route.destination)
		);

		route.chosenDirection = route.modeDirections[0].directions[0];

		return route;
	});
}

async function getFromApi(requests: RouteRequest[]): Promise<object[]> {
	const apiRequestData = requests.map((request: RouteRequest) => ({
		origin: request.origin,
		destination: request.destination,
		waypoints: request.waypoints,
		avoid: request.avoid,
		depart_at: request.departAt,
		arrive_at: request.arriveAt,
		modes: request.chosenMode ? [request.chosenMode] : null
	}));

	const CHUNK_SIZE: number = 50;
	const apiRequestDataChunks = splitArrayToChunks(apiRequestData, CHUNK_SIZE);
	const apiRequests: Promise<ApiResponse>[] = apiRequestDataChunks.map((apiRequestDataChunk) => {
		return StApi.post('/directions/path', apiRequestDataChunk);
	});
	const apiResponses: ApiResponse[] = await Promise.all(apiRequests);

	const chunkedPaths: any[][] = apiResponses.map((apiResponse: ApiResponse) => {
		apiResponse.data.path.map((routeData, index) => {
			cache.set(createCacheKey(requests[index]), routeData);
		});
		return apiResponse.data.path;
	});

	return flatten(chunkedPaths);
}

export async function sendDirections(
	email: string,
	destination: NamedLocation,
	origin?: NamedLocation,
	waypoints?: Waypoint[],
	avoid?: TransportAvoid[],
) {
	const apiRequestData: any = {
		user_email: email,
		destination
	};

	if (origin) {
		apiRequestData.origin = origin;
	}

	if (waypoints) {
		apiRequestData.waypoints = waypoints;
	}

	if (avoid) {
		apiRequestData.avoid = avoid;
	}

	try {
		await StApi.post('directions/send-by-email', decamelizeKeys(apiRequestData));
		return DirectionSendResponseCode.OK;
	} catch (e) {
		if (e.response.data.status_code === 422) {
			return DirectionSendResponseCode.ERROR_INVALID_INPUT;
		}
	}
	return DirectionSendResponseCode.ERROR;
}

const createCacheKey = (request: RouteRequest): string => {
	const parts: string[] = [];
	parts.push(request.origin.lat.toString());
	parts.push(request.origin.lng.toString());
	parts.push(request.destination.lat.toString());
	parts.push(request.destination.lng.toString());
	parts.push(request.avoid.join('-'));
	if (request.departAt) {
		parts.push(request.departAt);
	}
	if (request.waypoints) {
		parts.push(request.waypoints.map((waypoint) => (
			waypoint.location.lat.toString() + '-' + waypoint.location.lng.toString()
		)).join('-'));
	}
	return parts.join('-');
};
