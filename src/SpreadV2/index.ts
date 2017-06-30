export { SpreadResult, SpreadedPlace } from './Spreader';
export { CategoriesCoefficients, SpreadSizeConfig } from './Config';

import { Bounds } from '../Geo';
import { Place } from '../Places';
import { CanvasSize } from '../Spread';
import { CategoriesCoefficients, getConfig, SpreadSizeConfig } from './Config';
import * as Spreader from './Spreader';

export function spread(
	places: Place[],
	vipPlaces: Place[],
	bounds: Bounds,
	canvas: CanvasSize,
	categoriesCoefficients?: CategoriesCoefficients | null,
	sizesConfig?: SpreadSizeConfig[]
): Spreader.SpreadResult {
	if (!sizesConfig) {
		sizesConfig = getConfig();
	}
	return Spreader.spread(places, vipPlaces, sizesConfig, bounds, canvas, categoriesCoefficients);
}
