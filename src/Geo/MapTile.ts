import { Bounds, Location, locationToTileCoordinate, normalizeLng } from '.';
import { Coordinate } from './Coordinate';

export function boundsToMapTileKeys(bounds: Bounds , zoom: number): string[] {
	bounds = Object.assign({}, bounds);
	bounds.west = normalizeLng(bounds.west);
	bounds.east = normalizeLng(bounds.east);
	if (bounds.west > bounds.east) {
		const bounds1 = {
			south: bounds.south,
			west: bounds.west,
			north: bounds.north,
			east: 179.99999
		};
		const bounds2 = {
			south: bounds.south,
			west: -180,
			north: bounds.north,
			east: bounds.east
		};
		return boundsToMapTileKeys(bounds1, zoom).concat(boundsToMapTileKeys(bounds2, zoom));
	}

	const startTile = locationToTileCoordinate({lat: bounds.north, lng: bounds.east}, zoom);
	const endTile: Coordinate = locationToTileCoordinate({lat: bounds.south, lng: bounds.west}, zoom);
	const processedTile = {x: startTile.x, y: startTile.y};
	const quadkeys: string[] = [];
	while (processedTile.y <= endTile.y) {
		while (processedTile.x >= endTile.x) {
			quadkeys.push(coordinateToMapTileKey(processedTile, zoom));
			processedTile.x -= 1;
		}
		processedTile.y += 1;
		processedTile.x = startTile.x;
	}

	return quadkeys;
}

export function locationToMapTileKey(location: Location, zoom: number): string {
	return coordinateToMapTileKey(locationToTileCoordinate(location, zoom), zoom);
}

function coordinateToMapTileKey(coordinate: Coordinate, zoom: number): string {
	let tileKey = '';
	for (let i = zoom; i > 0; i--) {
		let digit = 0;
		const mask = 1 << (i - 1);
		if ((coordinate.x & mask) !== 0) {
			digit += 1;
		}
		if ((coordinate.y & mask) !== 0) {
			digit += 2;
		}
		tileKey += digit.toString();
	}
	return tileKey;
}
