import { Bounds, Coordinate, getZoomFromBounds, locationToCanvasCoordinate } from '../Geo';
import { Place } from '../Places/Place';
import { CanvasSize } from '../Spread';
import {
	CategoriesCoefficients,
	getRatingCoeficientFromCategories,
	isDisabledByCategory,
	SpreadSizeConfig
} from './Config';

export function spread(
	places: Place[],
	vipPlaces: Place[],
	markerSizes: SpreadSizeConfig[],
	bounds: Bounds,
	canvas: CanvasSize,
	categoriesCoefficients?: CategoriesCoefficients | null
): SpreadResult {
	const zoom = getZoomFromBounds(bounds, canvas.width);
	const finalResult = vipPlaces.reduce((result: SpreadResult, place: Place): SpreadResult => {
		return detectRenderSize(result, place, markerSizes, bounds, canvas, zoom);
	}, {
		hidden: [],
		visible: []
	});
	return places.reduce((result: SpreadResult, place: Place): SpreadResult => {
		return detectRenderSize(result, place, markerSizes, bounds, canvas, zoom, categoriesCoefficients);
	}, finalResult);
}

const detectRenderSize = (
	result: SpreadResult,
	place: Place,
	markerSizes: SpreadSizeConfig[],
	bounds: Bounds,
	canvas: CanvasSize,
	zoom: number,
	categoriesCoefficients?: CategoriesCoefficients | null
): SpreadResult => {
	let spreadRating = 0;
	if (categoriesCoefficients && place.level === 'poi') {
		spreadRating = place.rating * getRatingCoeficientFromCategories(categoriesCoefficients, place.categories);
	} else {
		spreadRating = place.rating;
	}

	if (!place.location) {
		result.hidden.push(place);
		return result;
	}

	const coordinate = locationToCanvasCoordinate(place.location, bounds, canvas);

	for (const size of markerSizes) {
		if (size.photoRequired && !place.thumbnailUrl) {
			continue;
		}

		const minimalRating = size.zoomLevelLimits[zoom - 1] ?
			size.zoomLevelLimits[zoom - 1] : size.zoomLevelLimits[size.zoomLevelLimits.length - 1];
		if (minimalRating && spreadRating < minimalRating) {
			continue;
		}

		if (place.level === 'poi' && isDisabledByCategory(size.disabledCategories, place.categories)) {
			continue;
		}

		if (!intersects(size, coordinate, result.visible)) {
			result.visible.push({
				place,
				coordinate,
				size
			});
			return result;
		}
	}
	result.hidden.push(place);
	return result;
};

const intersects = (size: SpreadSizeConfig, coordinate: Coordinate, spreadedPlaces: SpreadedPlace[]): boolean => {
	let radius2: number;
	let intersection: boolean;
	const radius1 = size.radius;
	for (const spreadedPlace of spreadedPlaces) {
		const biggerMargin = size.margin > spreadedPlace.size.margin ? size.margin : spreadedPlace.size.margin;
		radius2 = spreadedPlace.size.radius;
		intersection =  (Math.pow(coordinate.x - spreadedPlace.coordinate.x, 2) +
			Math.pow(coordinate.y - spreadedPlace.coordinate.y, 2)) <= Math.pow(radius1 + radius2 + biggerMargin, 2);
		if (intersection) {
			return true;
		}
	}
	return false;
};

export interface SpreadResult {
	visible: SpreadedPlace[];
	hidden: Place[];
}

export interface SpreadedPlace {
	place: Place;
	coordinate: Coordinate;
	size: SpreadSizeConfig;
}
