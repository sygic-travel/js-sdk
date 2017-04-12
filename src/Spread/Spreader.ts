import { Bounds, Coordinate, locationToCanvasCoordinate } from '../Geo';
import { Place } from '../Places/Place';
import { CanvasSize } from './Canvas';
import { SpreadConfigSize } from './Config';

export function spread(
	places: Place[],
	markerSizes: SpreadConfigSize[],
	bounds: Bounds,
	canvas: CanvasSize
): SpreadResult {
	return places.reduce((result: SpreadResult, place: Place): SpreadResult => {
		return detectRenderSize(result, place, markerSizes, bounds, canvas);
	}, {
		hidden: [],
		visible: []
	});
}

const detectRenderSize = (
	result: SpreadResult,
	place: Place,
	markerSizes: SpreadConfigSize[],
	bounds: Bounds,
	canvas: CanvasSize
): SpreadResult => {
	if (!place.location) {
		result.hidden.push(place);
		return result;
	}

	const coordinate = locationToCanvasCoordinate(place.location, bounds, canvas);
	if (coordinate.x < 0 || coordinate.y < 0 || coordinate.x > canvas.width || coordinate.y > canvas.height) {
		result.hidden.push(place);
		return result;
	}

	for (const size of markerSizes) {
		if (size.photoRequired && !place.thumbnailUrl) {
			continue;
		}
		if (size.minimalRating && place.rating <= size.minimalRating) {
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

const intersects = (size: SpreadConfigSize, coordinate: Coordinate, spreadedPlaces: SpreadedPlace[]): boolean => {
	let radius2: number;
	let intersection: boolean;
	const radius1 = size.radius + size.margin;
	for (const spreadedPlace of spreadedPlaces) {
		radius2 = spreadedPlace.size.radius + spreadedPlace.size.margin;
		intersection =  (Math.pow(coordinate.x - spreadedPlace.coordinate.x, 2) +
			Math.pow(coordinate.y - spreadedPlace.coordinate.y, 2)) <= Math.pow(radius1 + radius2, 2);
		if (intersection) {
			return true;
		}
	}
	return false;
};

interface SpreadResult {
	visible: SpreadedPlace[];
	hidden: Place[];
}

interface SpreadedPlace {
	place: Place;
	coordinate: Coordinate;
	size: SpreadConfigSize;
}
