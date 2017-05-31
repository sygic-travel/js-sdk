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
