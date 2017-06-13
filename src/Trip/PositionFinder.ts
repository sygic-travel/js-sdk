import { ItineraryItem } from '.';
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { isStickyByDefault, Place } from '../Places';

export function findOptimalPosition(
	place: Place,
	itineraryItems: ItineraryItem[]
): number {

	if (isStickyByDefault(place) && (!itineraryItems.length || !itineraryItems[itineraryItems.length - 1].isSticky)) {
		return itineraryItems.length;
	}

	let minDistance = 0;
	let minDistanceIndex = 0;
	let checkIndex = 0;
	const blockedIndexes: number[] = [];

	if (itineraryItems.find((item: ItineraryItem) => (item.place === null))) {
		throw new Error('Itinerary item place is not filled');
	}

	const locations: Location[] = itineraryItems.reduce((locs: Location[], item: ItineraryItem): Location[] => {
		if (item.place) {
			locs.push(item.place.location);
		}
		return locs;
	}, []);

	if (itineraryItems[0] && itineraryItems[0].isSticky) {
		blockedIndexes.push(0);
	}

	if (itineraryItems.length && itineraryItems[itineraryItems.length - 1].isSticky) {
		blockedIndexes.push(itineraryItems.length);
	}

	while (checkIndex <= locations.length) {
		const checkLocations = locations.slice();
		if (blockedIndexes.indexOf(checkIndex) !== -1) {
			checkIndex++;
			continue;
		}
		checkLocations.splice(checkIndex, 0, place.location);
		let prevLocation: Location;

		const pathDistance = checkLocations.reduce((distance: number, location: Location): number => {
			if (prevLocation) {
				distance += getDistance(prevLocation, location, EARTH_RADIUS);
			}
			prevLocation = location;
			return distance;
		}, 0);

		if (pathDistance <= minDistance || minDistance === 0) {
			minDistanceIndex = checkIndex;
			minDistance = pathDistance;
		}
		checkIndex++;
	}
	return minDistanceIndex;
}
