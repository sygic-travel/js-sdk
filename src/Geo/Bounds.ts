import * as geojsonExtent from '@mapbox/geojson-extent';
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

export function areBoundsInsideBounds(bounds1: Bounds, bounds2: Bounds): boolean {
	const southWest: Location = {
		lat: bounds1.south,
		lng: bounds1.west
	};

	const northEast: Location = {
		lat: bounds1.north,
		lng: bounds1.east
	};

	return isLocationInBounds(southWest, bounds2) && isLocationInBounds(northEast, bounds2);
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

export function extendBounds(bounds: Bounds, offset: number): Bounds {
	let southWest: Location = { lat: bounds.south, lng: bounds.west };
	let northEast: Location = { lat: bounds.north, lng: bounds.east };

	southWest = locationWithOffset(southWest, offset, 180);
	southWest = locationWithOffset(southWest, offset, 270);

	northEast = locationWithOffset(northEast, offset, 0);
	northEast = locationWithOffset(northEast, offset, 90);

	return {
		south: southWest.lat,
		west: southWest.lng,
		north: northEast.lat,
		east: northEast.lng
	};
}

export function getGeoJsonAndBoundsIntersection(geoJson: GeoJSON.DirectGeometryObject, bounds: Bounds): boolean {
	const geoJsonExtent: number = geojsonExtent(geoJson);
	const geoJsonBounds: Bounds = {
		west: geoJsonExtent[0],
		south: geoJsonExtent[1],
		east: geoJsonExtent[2],
		north: geoJsonExtent[3]
	};

	const latIntersects: boolean = (bounds.north >= geoJsonBounds.south) && (bounds.south <= geoJsonBounds.north);
	const lngIntersects: boolean = (bounds.east >= geoJsonBounds.west) && (bounds.west <= geoJsonBounds.east);

	return latIntersects && lngIntersects;
}
