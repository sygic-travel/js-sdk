import { Bounds, getZoomFromBounds } from '../Geo';
import { CanvasSize } from './Canvas';

export interface SpreadSizeConfig {
	radius: number;
	margin: number;
	name: string;
	photoRequired?: boolean;
	minimalRating?: number;
}

/**
 * https://confluence.sygic.com/display/STV/Map+Markers
 */
export function getConfig(
	bounds: Bounds,
	canvas: CanvasSize
): SpreadSizeConfig[] {
	const zoom = getZoomFromBounds(bounds, canvas.width);
	return [
		{
			radius: 29,
			margin: 10,
			name: 'popular',
			photoRequired: true,
			minimalRating: 0.3,
		},
		{
			radius: 22,
			margin: 5,
			name: 'big',
			photoRequired: true,
			minimalRating: zoom < 10 ? 0.001 : 0,
		},
		{
			radius: 10,
			margin: 5,
			name: 'medium',
			photoRequired: false,
			minimalRating: zoom < 10 ? 0.001 : 0,
		},
		{
			radius: 4,
			margin: 5,
			name: 'small',
			photoRequired: false,
			minimalRating: zoom < 10 ? 0.001 : 0,
		}
	];
}
