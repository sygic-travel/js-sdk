import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { Place } from '../Places';

export function findOptimalPosition(place: Place, dayPlaces: Place[]): number {
	let minDistance = 0;
	let minDistanceIndex = 0;
	let checkIndex = 0;
	const locations: Location[] = dayPlaces.map((dPlace: Place): Location => (dPlace.location));

	while (checkIndex < dayPlaces.length + 1) {
		const checkLocations = locations.slice();
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
