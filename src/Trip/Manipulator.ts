import { Day, Trip } from '.';
import { isStickyByDefault, Place } from '../Places';
import { UserSettings } from '../Session';
import { addDaysToDate, cloneDeep, subtractDaysFromDate } from '../Util';
import { resolveStickiness } from './Mapper';
import { ItineraryItem, TransportSettings } from './Trip';
import { decorateDaysWithDate } from './Utility';

// Day methods
export function appendDay(tripToBeUpdated: Trip, userSettings: UserSettings | null): Trip {
	let resultTrip = cloneDeep(tripToBeUpdated);

	if (!resultTrip.days) {
		throw new Error('days property in Trip cannot be null');
	}

	resultTrip.days.push({
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.endsOn = resultTrip.endsOn ? addDaysToDate(resultTrip.endsOn, 1) : null;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);

	if (resultTrip.days[resultTrip.days.length - 2].itinerary.length > 0) {
		const lastItem = resultTrip.days[resultTrip.days.length - 2].itinerary[
			resultTrip.days[resultTrip.days.length - 2].itinerary.length - 1
		];
		if (lastItem.place && isStickyByDefault(lastItem.place) && lastItem.isStickyLastInDay) {
			resultTrip = addPlaceToDay(resultTrip, lastItem.place, resultTrip.days.length - 1, userSettings, 0);
		}
	}
	return resolveStickiness(resultTrip, userSettings);
}

export function prependDayToTrip(tripToBeUpdated: Trip, userSettings: UserSettings | null): Trip {
	let resultTrip = cloneDeep(tripToBeUpdated);

	if (!resultTrip.days) {
		throw new Error('days property in Trip cannot be null');
	}

	resultTrip.days.unshift({
		itinerary: [],
		note: null,
		date: null
	} as Day);

	resultTrip.startsOn = resultTrip.startsOn ? subtractDaysFromDate(resultTrip.startsOn, 1) : null;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);

	if (resultTrip.days[1].itinerary.length > 0) {
		const firstItem = resultTrip.days[1].itinerary[0];
		if (firstItem.place && isStickyByDefault(firstItem.place) && firstItem.isStickyFirstInDay) {
			resultTrip = addPlaceToDay(resultTrip, firstItem.place, 0, userSettings, 0);
		}
	}
	return resolveStickiness(resultTrip, userSettings);
}

export function addDaysToTrip(
	trip: Trip,
	appendCount: number,
	prependCount: number,
	userSettings: UserSettings | null
): Trip {
	for (let i = 0; i < appendCount; i++) {
		trip = appendDay(trip, null);
	}
	for (let i = 0; i < prependCount; i++) {
		trip = prependDayToTrip(trip, null);
	}
	return resolveStickiness(trip, userSettings);
}

export function addDayToTrip(
	trip: Trip,
	dayIndex: number,
	userSettings: UserSettings | null
): Trip {
	checkDayExists(trip, dayIndex);

	let resultTrip = cloneDeep(trip);
	resultTrip.days.splice(dayIndex, 0, {
		itinerary: [],
		note: null,
		date: null
	} as Day);
	resultTrip.endsOn = resultTrip.endsOn ? addDaysToDate(resultTrip.endsOn, 1) : null;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);

	if (dayIndex > 0 && resultTrip.days[dayIndex - 1].itinerary.length > 0) {
		const previousDayLastPlaceIndex = resultTrip.days[dayIndex - 1].itinerary.length - 1;
		const previousDayLastPlace = resultTrip.days[dayIndex - 1].itinerary[previousDayLastPlaceIndex];
		if (previousDayLastPlace.place && previousDayLastPlace.isStickyLastInDay) {
			resultTrip = addPlaceToDay(resultTrip, previousDayLastPlace.place, dayIndex, userSettings);
		}
	}
	if (dayIndex !== 0 && resultTrip.days[dayIndex + 1].itinerary.length > 0) {
		const nextDayFirstPlace = resultTrip.days[dayIndex + 1].itinerary[0];
		const placeFromPreviousDay = resultTrip.days[dayIndex].itinerary[0];
		if (!placeFromPreviousDay || placeFromPreviousDay && placeFromPreviousDay.placeId !== nextDayFirstPlace.placeId) {
			if (nextDayFirstPlace.place && nextDayFirstPlace.isStickyFirstInDay) {
				resultTrip = addPlaceToDay(resultTrip, nextDayFirstPlace.place, dayIndex, userSettings);
			}
		}
	}
	return resolveStickiness(resultTrip, userSettings);
}

export function removeDayFromTrip(tripToBeUpdated: Trip, dayIndex: number, userSettings: UserSettings | null): Trip {
	checkDayExists(tripToBeUpdated, dayIndex);

	const resultTrip = cloneDeep(tripToBeUpdated);

	if (resultTrip.endsOn) {
		resultTrip.endsOn = subtractDaysFromDate(resultTrip.endsOn, 1);
	}

	resultTrip.days.splice(dayIndex, 1);
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resolveStickiness(resultTrip, userSettings);
}

export function swapDaysInTrip(
	tripToBeUpdated: Trip,
	firstDayIndex: number,
	secondDayIndex: number,
	userSettings: UserSettings | null
): Trip {
	checkDayExists(tripToBeUpdated, firstDayIndex, 'firstDayIndex');
	checkDayExists(tripToBeUpdated, secondDayIndex, 'secondDayIndex');

	const resultTrip = cloneDeep(tripToBeUpdated);
	const firstDay: Day = resultTrip.days[firstDayIndex];
	const secondDay: Day = resultTrip.days[secondDayIndex];
	resultTrip.days[firstDayIndex] = secondDay;
	resultTrip.days[secondDayIndex] = firstDay;
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resolveStickiness(resultTrip, userSettings);
}

export function setTransport(
	trip: Trip,
	dayIndex: number,
	itemIndex: number,
	settings: TransportSettings | null
): Trip {
	checkItemExists(trip, dayIndex, itemIndex);

	const resultTrip = cloneDeep(trip);
	resultTrip.days[dayIndex].itinerary[itemIndex].transportFromPrevious = settings;
	return resultTrip;
}

export function updateItineraryItemUserData(
	trip: Trip,
	dayIndex: number,
	itemIndex: number,
	startTime: number | null,
	duration: number | null,
	note: string | null
): Trip {
	checkItemExists(trip, dayIndex, itemIndex);

	const resultTrip = cloneDeep(trip);
	resultTrip.days[dayIndex].itinerary[itemIndex].startTime = startTime;
	resultTrip.days[dayIndex].itinerary[itemIndex].duration = duration;
	resultTrip.days[dayIndex].itinerary[itemIndex].note = note;
	return resultTrip;
}

export function updateDayNote(trip: Trip, dayIndex: number, note: string): Trip {
	checkDayExists(trip, dayIndex);

	const resultTrip: Trip = cloneDeep(trip);
	resultTrip.days[dayIndex].note = note;
	return resultTrip;
}

// Item methods
export function addPlaceToDay(
	tripToBeUpdated: Trip,
	placeToBeAdded: Place,
	dayIndex: number,
	userSettings: UserSettings | null,
	positionInDay?: number,
	transportFromPrevious?: TransportSettings | null
): Trip {
	checkDayExists(tripToBeUpdated, dayIndex);
	if (
		typeof positionInDay !== 'undefined' &&
		positionInDay !== null &&
		(tripToBeUpdated.days[dayIndex].itinerary.length < positionInDay || positionInDay < 0)
	) {
		throw new Error('Invalid positionInDay');
	}

	const resultTrip = cloneDeep(tripToBeUpdated);
	const itineraryItem: ItineraryItem = {
		place: placeToBeAdded,
		placeId: placeToBeAdded.id,
		startTime: null,
		duration: null,
		isSticky: false,
		isStickyFirstInDay: false,
		isStickyLastInDay: false,
		note: null,
		transportFromPrevious: transportFromPrevious || null
	};

	if (typeof positionInDay === 'undefined' || positionInDay === null) {
		positionInDay = resultTrip.days[dayIndex].itinerary.length;
	}

	resultTrip.days[dayIndex].itinerary.splice(positionInDay, 0, itineraryItem);
	return resolveStickiness(resultTrip, userSettings);
}

export function duplicateItineraryItem(
	tripToBeUpdated: Trip,
	dayIndex: number,
	itemIndex: number,
	resetTransport: boolean,
	userSettings: UserSettings | null
): Trip {
	checkItemExists(tripToBeUpdated, dayIndex, itemIndex);
	const trip: Trip = cloneDeep(tripToBeUpdated);
	const itemToAdd = cloneDeep(trip.days![dayIndex].itinerary[itemIndex]);
	if (resetTransport) {
		itemToAdd.transportFromPrevious = null;
	}
	trip.days[dayIndex].itinerary.splice(itemIndex + 1, 0, itemToAdd);
	return resolveStickiness(trip, userSettings);
}

export function movePlaceInDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionFrom: number,
	positionTo: number,
	userSettings: UserSettings | null
): Trip {
	checkItemExists(tripToBeUpdated, dayIndex, positionFrom, 'positionFrom');
	checkItemExists(tripToBeUpdated, dayIndex, positionTo, 'positionTo');

	const resultTrip = cloneDeep(tripToBeUpdated);
	const itemToBeMoved: ItineraryItem = resultTrip.days[dayIndex].itinerary[positionFrom];
	resultTrip.days[dayIndex].itinerary.splice(positionFrom, 1);
	resultTrip.days[dayIndex].itinerary.splice(positionTo, 0, itemToBeMoved);
	return resolveStickiness(resultTrip, userSettings);
}

export function removePlacesFromDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	positionsInDay: number[],
	userSettings: UserSettings | null
): Trip {
	checkDayExists(tripToBeUpdated, dayIndex);

	positionsInDay.forEach((positionInDay: number) => {
		if (tripToBeUpdated.days && !tripToBeUpdated.days[dayIndex].itinerary[positionInDay]) {
			throw new Error('Invalid positionInDay');
		}
	});

	const resultTrip = cloneDeep(tripToBeUpdated);
	resultTrip.days[dayIndex].itinerary = resultTrip.days[dayIndex]
		.itinerary.filter((itineraryItem: ItineraryItem, index: number) => {
		return positionsInDay.indexOf(index) < 0;
	});
	return resolveStickiness(resultTrip, userSettings);
}

export function removeAllPlacesFromDay(
	tripToBeUpdated: Trip,
	dayIndex: number,
	userSettings: UserSettings | null
): Trip {
	checkDayExists(tripToBeUpdated, dayIndex);

	const resultTrip = cloneDeep(tripToBeUpdated);
	resultTrip.days[dayIndex].itinerary = [];
	return resolveStickiness(resultTrip, userSettings);
}

export function addOrReplaceOvernightPlace(
	trip: Trip,
	place: Place,
	dayIndex: number,
	userSettings: UserSettings | null
): Trip {
	checkDayExists(trip, dayIndex);

	let resultTrip = cloneDeep(trip);
	let transportSettings: TransportSettings | null = null;

	// Remove old sticky places
	if (
		trip.days[dayIndex].itinerary.length &&
		trip.days[dayIndex].itinerary[trip.days![dayIndex].itinerary.length - 1].isStickyLastInDay &&
		!trip.days[dayIndex].itinerary[trip.days![dayIndex].itinerary.length - 1].isStickyFirstInDay
	) {
		transportSettings = cloneDeep(
			trip.days[dayIndex].itinerary[trip.days![dayIndex].itinerary.length - 1].transportFromPrevious
		);
		resultTrip = removePlacesFromDay(
			resultTrip,
			dayIndex,
			[resultTrip.days[dayIndex].itinerary.length - 1],
			userSettings
		);
	}
	const nextDayIndex = dayIndex + 1;
	if (
		trip.days[nextDayIndex] &&
		trip.days[nextDayIndex].itinerary.length &&
		trip.days[nextDayIndex].itinerary[0].isStickyFirstInDay &&
		!trip.days[nextDayIndex].itinerary[0].isStickyLastInDay
	) {
		resultTrip = removePlacesFromDay(resultTrip, nextDayIndex, [0], userSettings);
	}

	// Add new sticky places if they are not already there
	if (
		resultTrip.days[dayIndex].itinerary.length === 0 ||
		resultTrip.days[dayIndex].itinerary[resultTrip.days[dayIndex].itinerary.length - 1].placeId !== place.id
	) {
		resultTrip = addPlaceToDay(
			resultTrip,
			place,
			dayIndex,
			userSettings,
			resultTrip.days[dayIndex].itinerary.length,
			transportSettings
		);
	}

	if (
		resultTrip.days[nextDayIndex] &&
		(
			resultTrip.days[nextDayIndex].itinerary.length === 0 ||
			resultTrip.days[nextDayIndex].itinerary[0].placeId !== place.id
		)
	) {
		resultTrip = addPlaceToDay(resultTrip, place, nextDayIndex, userSettings, 0);
	}
	return resolveStickiness(resultTrip, userSettings);
}

function checkDayExists(
	trip: Trip,
	dayIndex: number,
	propertyName: string = 'dayIndex'
): boolean {
	if (!trip.days[dayIndex]) {
		throw new Error('Invalid ' + propertyName);
	}
	return true;
}

function checkItemExists(
	trip: Trip,
	dayIndex: number,
	itemIndex: number,
	propertyName: string = 'itemIndex'
): boolean {
	checkDayExists(trip, dayIndex);
	if (!trip.days[dayIndex].itinerary[itemIndex]) {
		throw new Error('Invalid ' + propertyName);
	}
	return true;
}

export function removePlaceFromDayByPlaceId(
	trip: Trip,
	placeId: string,
	dayIndex: number,
	userSettings: UserSettings | null
): Trip {
	checkDayExists(trip, dayIndex);
	const resultTrip = cloneDeep(trip);
	resultTrip.days[dayIndex].itinerary = resultTrip.days[dayIndex]
		.itinerary.filter((itineraryItem: ItineraryItem) => {
			return itineraryItem.placeId !== placeId;
		});
	return resolveStickiness(resultTrip, userSettings);
}

export function removePlaceFromDaysByPlaceId(
	trip: Trip,
	placeId: string,
	daysIndexes: number[],
	userSettings: UserSettings | null
): Trip {
	let resultTrip = cloneDeep(trip);
	daysIndexes.forEach((dayIndex: number) => {
		resultTrip = removePlaceFromDayByPlaceId(
			resultTrip,
			placeId,
			dayIndex,
			userSettings
		);
	});
	return resultTrip;
}

export function setStartDate(trip: Trip, startsOn: string): Trip {
	const resultTrip: Trip = cloneDeep(trip);
	resultTrip.startsOn = startsOn;
	resultTrip.endsOn = addDaysToDate(startsOn, trip.days ? trip.days.length - 1 : 0);
	resultTrip.days = decorateDaysWithDate(resultTrip.startsOn, resultTrip.days);
	return resultTrip;
}
