import { getPlaceDetailedBatch } from '../Places/index';
import * as Dao from './DataAccess';
import {
	putPlacesToTrip
} from './Mapper';
import { Day, ItineraryItem, Trip } from './Trip';

export {
	Trip
};

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	return await Dao.getTrips(dateTo, dateFrom);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const tripWithoutPlaces: Trip = await Dao.getTripDetailed(id);
	if (tripWithoutPlaces.days) {
		return await addPlacesToTrip(tripWithoutPlaces);
	}
	return tripWithoutPlaces;
}

async function addPlacesToTrip(tripWithoutPlaces: Trip): Promise<Trip> {
	const placesGuids: string[] = getPlacesIdsFromTrip(tripWithoutPlaces);
	return putPlacesToTrip(tripWithoutPlaces, await getPlaceDetailedBatch(placesGuids, '300x300'));
}

export function getPlacesIdsFromTrip(trip: Trip): string[] {
	if (!trip.days) {
		return [];
	}

	const initAcc: string[] = [];
	return trip.days.reduce((acc, day: Day): string[] => ([
		...acc,
		...day.itinerary.map((itineraryItem: ItineraryItem): string => (itineraryItem.placeId))
	]), initAcc);
}
