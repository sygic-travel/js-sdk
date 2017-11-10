import { ItineraryItem, Trip, UNBREAKABLE_TRANSPORT_MODES } from '.';
import { EARTH_RADIUS, getDistance, Location } from '../Geo';
import { isStickyByDefault, Place } from '../Places';
import { UserSettings } from '../User';

export const DESTINATION_BREAK_LEVELS = ['city', 'town', 'village', 'island'];

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
	trip: Trip,
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

export interface AddToTripInstructions {
	position: number;
	shouldDuplicate: boolean;
}

interface PositionScore {
	penalty: number;
	shouldSplit: boolean;
}

export function getAddToTripInstructions(
	place: Place,
	trip: Trip,
	dayIndex: number,
	acceptableDestinationsIds: string[],
	userSettings: UserSettings,
): AddToTripInstructions {
	// Build positions score
	let position: number = 0;
	const positionScores: PositionScore[] = [];
	let previousDestinationMatch = false;
	const itinerary = trip.days![dayIndex].itinerary;

	// Adding home/work to first day
	if (dayIndex === 0 && (place.id === userSettings.homePlaceId || place.id === userSettings.workPlaceId)) {
		return {
			position: 0,
			shouldDuplicate: false,
		} as AddToTripInstructions;
	}
	// Adding home/work to last day
	if (
		dayIndex === trip.days!.length - 1 &&
		(place.id === userSettings.homePlaceId || place.id === userSettings.workPlaceId)
	) {
		return {
			position: trip.days![dayIndex].itinerary.length,
			shouldDuplicate: false,
		} as AddToTripInstructions;
	}
	// only home/work in first day usecase
	if (dayIndex === 0 &&
		itinerary.length === 1 &&
		(itinerary[0].placeId === userSettings.homePlaceId || itinerary[0].placeId === userSettings.workPlaceId)
	) {
		return {
			position: trip.days!.length === 1 ? 0 : 1,
			shouldDuplicate: trip.days!.length === 1,
		} as AddToTripInstructions;
	}

	while (position < itinerary.length) {
		let score = {
			penalty: 0,
			shouldSplit: false
		};
		const item: ItineraryItem = itinerary[position];

		const matchedDestinations = item.place!.parents.filter(
			(parentId: string) => acceptableDestinationsIds.includes(parentId)
		);

		if (matchedDestinations.length === 0 && !previousDestinationMatch) {
			score.penalty += 10;
		}

		if (hasUnbreakableRoute(item) || (item.isSticky && position === 0)) {
			score.penalty += 10;
			score.shouldSplit = true;
		}

		positionScores.push(score);
		previousDestinationMatch = matchedDestinations.length !== 0;
		position++;

		// Add penalty for last position
		if (position === itinerary.length) {
			score = {
				penalty: 0,
				shouldSplit: false
			};
			if (matchedDestinations.length === 0) {
				score.penalty += 10;
			}
			if (trip.days![dayIndex + 1] &&
				trip.days![dayIndex + 1].itinerary[0] &&
				hasUnbreakableRoute(trip.days![dayIndex + 1].itinerary[0])
			) {
				score.penalty += 30;
				score.shouldSplit = false;
			}
			if (item.isSticky) {
				score.penalty = 30;
				score.shouldSplit = false;
			}
			positionScores.push(score);
		}
	}

	const minimalPenalty = positionScores.reduce((min, score) => score.penalty < min ? score.penalty : min, Infinity);
	const locations: Location[] = itinerary.map((item: ItineraryItem) => item.place!.location);

	let checkIndex = 0;
	let minDistance = Infinity;
	let minDistanceIndex = locations.length;
	while (checkIndex < positionScores.length) {
		const checkLocations = locations.slice();
		if (positionScores[checkIndex].penalty !== minimalPenalty) {
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

		if (pathDistance <= minDistance) {
			minDistanceIndex = checkIndex;
			minDistance = pathDistance;
		}
		checkIndex++;
	}

	return {
		position: minDistanceIndex,
		shouldDuplicate: positionScores[minDistanceIndex] ? positionScores[minDistanceIndex].shouldSplit : false
	} as AddToTripInstructions;
}

function hasUnbreakableRoute(item: ItineraryItem): boolean {
	return !!(item.transportFromPrevious && UNBREAKABLE_TRANSPORT_MODES.includes(item.transportFromPrevious.mode));
}
