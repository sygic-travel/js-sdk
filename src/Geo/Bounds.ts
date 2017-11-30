import { Location } from '.';
import { toDegrees } from '../Util';
import { locationWithOffset } from './Location';

export interface Bounds {
	south: number;
	west: number;
	north: number;
	east: number;
}

/**
 * https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
 */
export function getZoomFromBounds(
	bounds: Bounds,
	pixelWidth: number
): number {
	const GLOBE_WIDTH = 256;
	const angle = bounds.east - bounds.west;
	return Math.round(Math.log(pixelWidth * 360 / angle / GLOBE_WIDTH) / Math.LN2);
}

export function isLocationInBounds(location: Location, bounds: Bounds): boolean {
	return location.lat >= bounds.south
		&& location.lat <= bounds.north
		&& location.lng >= bounds.west
		&& location.lng <= bounds.east;
}

export function calculateLocationsBounds(locations: Location[]): Bounds {
	if (locations.length === 1) {
		return createBoundsFromLocationAndSize(locations[0], 2000, 2000);
	}

	const bounds: Bounds = {
		south: -Infinity,
		west: -Infinity,
		north: -Infinity,
		east: -Infinity
	};

	locations.forEach((location: Location) => {
		const locationLat: number = location.lat;
		const locationLng: number = location.lng;

		if (bounds.north === -Infinity) {
			bounds.north = locationLat;
			bounds.east = locationLng;
		}
		if (bounds.south === -Infinity) {
			bounds.south = locationLat;
			bounds.west = locationLng;
		}
		if (bounds.north < locationLat) {
			bounds.north = locationLat;
		}
		if (bounds.east < locationLng) {
			bounds.east = locationLng;
		}
		if (bounds.south > locationLat) {
			bounds.south = locationLat;
		}
		if (bounds.west > locationLng) {
			bounds.west = locationLng;
		}
	});
	return bounds;
}

export function createBoundsFromLocationAndSize(
	location: Location,
	width: number,
	height: number
): Bounds {
	const diagonal: number = Math.sqrt(width * width + height * height);
	const alpha: number = toDegrees(Math.asin(height / diagonal));
	const sw: Location = locationWithOffset(location, diagonal, 270 - alpha);
	const ne: Location = locationWithOffset(location, diagonal, 90 - alpha);
	return {
		south: sw.lat,
		west: sw.lng,
		north: ne.lat,
		east: ne.lng
	} as Bounds;
}
