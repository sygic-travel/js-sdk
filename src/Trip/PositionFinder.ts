import { ItineraryItem, Trip } from '.';
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { isStickyByDefault, Place } from '../Places';
import { UserSettings } from '../User';

export function findOptimalPositionInDay(
	place: Place,
	previousDayLastItem: ItineraryItem|null,
	itinerary: ItineraryItem[]
): number {

	if (isStickyByDefault(place) && (!itinerary.length || !itinerary[itinerary.length - 1].isSticky)) {
		return itinerary.length;
	}

	let minDistance = 0;
	let minDistanceIndex = 0;
	let checkIndex = 0;
	const blockedIndexes: number[] = [];

	if (itinerary.find((item: ItineraryItem) => (item.place === null))) {
		throw new Error('Itinerary item place is not filled');
	}

	const locations: Location[] = itinerary.reduce((locs: Location[], item: ItineraryItem): Location[] => {
		if (item.place) {
			locs.push(item.place.location);
		}
		return locs;
	}, []);

	if (itinerary[0] && itinerary[0].isSticky) {
		blockedIndexes.push(0);
		if (previousDayLastItem && previousDayLastItem.isSticky) {
			minDistanceIndex = 1;
		}
	}

	if (itinerary.length && itinerary[itinerary.length - 1].isSticky) {
		blockedIndexes.push(itinerary.length);
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

export function findOptimalPosition(
	place: Place,
	userSettings: UserSettings,
	dayIndex: number,
	trip: Trip
): number {
	if (dayIndex === 0 && (place.id === userSettings.homePlaceId || place.id === userSettings.workPlaceId)) {
		return 0;
	} else if (
		trip.days && dayIndex === trip.days.length - 1 &&
		(place.id === userSettings.homePlaceId || place.id === userSettings.workPlaceId)
	) {
		return trip.days[dayIndex].itinerary.length;
	}
	const prevItinerary: ItineraryItem[]|null = trip.days && dayIndex !== 0 ? trip.days[dayIndex - 1].itinerary : null;

	return findOptimalPositionInDay(
		place,
		prevItinerary ? prevItinerary[prevItinerary.length - 1] : null,
		trip.days ? trip.days[dayIndex].itinerary : []
	);
}
