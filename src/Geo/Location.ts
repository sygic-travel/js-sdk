import { Bounds, Coordinate } from '.';
import { CanvasSize } from '../Spread';

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
