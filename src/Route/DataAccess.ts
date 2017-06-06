import { Mapper, Route, RouteRequest } from '.';
import { routesCache as cache } from '../Cache';
import { ApiResponse, post } from '../Xhr';
import { estimatePlaneDirection } from './Estimator';

export async function getRoutes(requests: RouteRequest[]): Promise<Route[]> {
	const keys: string[] = requests.map(createCacheKey);
	const cached = await cache.getBatchMap(keys);
	const routesData: any[] = keys.map((key: string) => (cached.get(key)));
	const apiData =  await getFromApi(requests.filter((request: RouteRequest, index: number) => (!routesData[index])));
	return routesData.map((routeData: object|null) => {
		if (routeData === null) {
			return apiData.shift();
		}
		return routeData;
	}).map((routeData, index) => {
		const route = Mapper.mapRouteFromApiResponse(
			routeData,
			requests[index].avoid,
			requests[index].chosenMode,
			requests[index].type
		);
		route.modeDirections.push({
			mode: 'plane',
			directions: [estimatePlaneDirection(route.origin, route.destination)]
		});
		route.chosenDirection = Mapper.choseDirection(route.modeDirections, requests[index].chosenMode, requests[index].type);
		return route;
	});
}

async function getFromApi(requests: RouteRequest[]): Promise<object[]> {
	const apiRequestData = requests.map((request: RouteRequest) => ({
		origin: request.origin,
		destination: request.destination,
		waypoints: request.waypoints,
		avoid: request.avoid,
		type: request.type,
	}));

	const response: ApiResponse = await post('/directions/path', apiRequestData);
	response.data.path.map( (routeData, index) => {
		cache.set(createCacheKey(requests[index]), routeData);
	});
	return response.data.path;
}

const createCacheKey = (request: RouteRequest): string => {
	const parts: string[] = [];
	parts.push(request.type);
	parts.push(request.origin.lat.toString());
	parts.push(request.origin.lng.toString());
	parts.push(request.destination.lat.toString());
	parts.push(request.destination.lng.toString());
	parts.push(request.avoid.join('-'));
	if (request.waypoints) {
		parts.push(request.waypoints.map((waypoint) => (waypoint.lat.toString() + '-' + waypoint.lng.toString())).join('-'));
	}
	return parts.join('-');
};
