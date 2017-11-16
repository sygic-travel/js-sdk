import { Bounds, Coordinate } from '.';
import { CanvasSize } from '../Spread';
import { EARTH_RADIUS } from '.';

export interface Location {
	lat: number;
	lng: number;
}

export function locationToTileCoordinate(location: Location, zoom: number): Coordinate {
	const tileSize = 256;
	const x = (location.lng + 180) / 360;
	const sinLat = Math.sin(location.lat * Math.PI / 180);
	const y = 0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI);
	const mapSize = tileSize << zoom;
	const tileX = clip(x * mapSize + 0.5, 0, mapSize - 1) / tileSize;
	const tileY = clip(y * mapSize + 0.5, 0, mapSize - 1) / tileSize;
	return {
		x: Math.floor(tileX),
		y: Math.floor(tileY)
	};
}

export function locationToCanvasCoordinate(location: Location, bounds: Bounds, canvas: CanvasSize): Coordinate {
	const latDiff: number = bounds.north - location.lat;
	let lngDiff: number = location.lng - bounds.west;
	const latRatio: number  = canvas.height / Math.abs(bounds.south - bounds.north);
	let lngRatio: number = canvas.width / Math.abs(bounds.west - bounds.east);

	if (bounds.west > bounds.east) {
		lngRatio = canvas.width / Math.abs(180 - bounds.west + 180 + bounds.east);
		if (location.lng < 0 && location.lng < bounds.east) {
			lngDiff = 180 - bounds.west + 180 + location.lng;
		}
		if (location.lng > 0 && location.lng < bounds.west) {
			lngDiff = 180 - bounds.west + 180 + location.lng;
		}
	}
	return {
		x: Math.round(lngDiff * lngRatio),
		y: Math.round(latDiff * latRatio)
	};
};

export function normalizeLng(lng: number) {
	let compValue = Math.abs(lng);
	if (compValue > 360) {
		compValue -= 360 * Math.floor(compValue / 360);
	}
	if (compValue > 180) {
		compValue = compValue - 360;
	}
	return lng < 0 ? compValue * -1 : compValue;
};

const clip = (n: number, min: number, max: number): number => {
	return Math.max(min, Math.min(n, max));
};

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

function locationWithOffset(location: Location, distance: number, heading: number): Location {
	heading = toRadians(heading);
	const latRad: number = toRadians(location.lat);
	const lngRad: number = toRadians(location.lng);
	const dR: number = distance / EARTH_RADIUS;
	const finalLat: number = Math.asin(
		Math.sin(latRad) * Math.cos(dR) + Math.cos(latRad) * Math.sin(dR) * Math.cos(heading)
	);
	const finalLng: number = lngRad + Math.atan2(
		Math.sin(heading) * Math.sin(dR) * Math.cos(latRad), Math.cos(dR) - Math.sin(latRad) * Math.sin(finalLat)
	);
	return {
		lat: toDegrees(finalLat),
		lng: toDegrees(finalLng)
	};
}

function toRadians(degrees: number): number {
	return degrees * Math.PI / 180;
}

function toDegrees(radians: number): number {
	return radians * 180 / Math.PI;
}
