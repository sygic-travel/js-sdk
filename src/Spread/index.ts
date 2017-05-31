export { SpreadResult, SpreadedPlace } from './Spreader';
export { SpreadSizeConfig, getConfig } from './Config';
export { CanvasSize } from './Canvas';

import { Bounds } from '../Geo';
import { Place } from '../Places';
import { CanvasSize } from './Canvas';
import {getConfig, SpreadSizeConfig} from './Config';
import * as Spreader from './Spreader';

export function spread(
	places: Place[],
	bounds: Bounds,
	canvas: CanvasSize,
	sizesConfig?: SpreadSizeConfig[]
): Spreader.SpreadResult {
	if (!sizesConfig) {
		sizesConfig = getConfig(bounds, canvas);
	}
	return Spreader.spread(places, sizesConfig, bounds, canvas);
}
