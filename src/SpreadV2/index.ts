export { SpreadResult, SpreadedPlace } from './Spreader';
export { CategoriesCoefficients, SpreadSizeConfig } from './Config';

import { Bounds } from '../Geo';
import { Place } from '../Places';
import { CanvasSize } from '../Spread';
import { CategoriesCoefficients, getCategoriesConfig, getSizesConfig,  SpreadSizeConfig } from './Config';
import * as Spreader from './Spreader';

export function spread(
	places: Place[],
	vipPlaces: Place[],
	bounds: Bounds,
	canvas: CanvasSize,
	sizesConfig?: SpreadSizeConfig[],
	categoriesCoefficients?: CategoriesCoefficients | null
): Spreader.SpreadResult {
	if (!sizesConfig) {
		sizesConfig = getSizesConfig();
	}
	if (!categoriesCoefficients && categoriesCoefficients !== null) {
		categoriesCoefficients = getCategoriesConfig();
	}
	return Spreader.spread(places, vipPlaces, sizesConfig, bounds, canvas, categoriesCoefficients);
}
