import { Location } from '.';

export const EARTH_RADIUS = 6378137;

export const getDistance = (point1: Location, point2: Location, radius: number): number => {
	const lat1 = point1.lat * Math.PI / 180;
	const lng1 = point1.lng * Math.PI / 180;
	const lat2 = point2.lat * Math.PI / 180;
	const lng2 = point2.lng * Math.PI / 180;
	return Math.round(
		Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1))
		* radius
	);
};
