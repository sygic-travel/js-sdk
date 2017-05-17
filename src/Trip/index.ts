import { getPlaceDetailedBatch } from '../Places/index';
import * as Dao from './DataAccess';
import {
	mapTripDetailedApiResponseToTrip,
	mapTripListApiResponseToTripsList,
	putPlacesToTrip
} from './Mapper';
import { Day, ItineraryItem, Trip } from './Trip';

export {
	Trip
};

export async function getTrips(dateFrom: string, dateTo: string): Promise<Trip[]> {
	const trips: any = await Dao.getTrips(dateTo, dateFrom);
	return mapTripListApiResponseToTripsList(trips);
}

export async function getTripDetailed(id: string): Promise<Trip> {
	const tripDetailed: any = await Dao.getTripDetailed(id);
	const tripWithoutPlaces: Trip = mapTripDetailedApiResponseToTrip(tripDetailed);
	if (tripWithoutPlaces.days) {
		return await addPlacesToTrip(tripWithoutPlaces);
	}
	return tripWithoutPlaces;
}

async function addPlacesToTrip(tripWithoutPlaces: Trip): Promise<Trip> {
	const placesGuids: string[] = getPlacesGuidsFromTrip(tripWithoutPlaces);
	return putPlacesToTrip(tripWithoutPlaces, await getPlaceDetailedBatch(placesGuids, '300x300'));
}

export function getPlacesGuidsFromTrip(trip: Trip): string[] {
	if (!trip.days) {
		return [];
	}

	const initAcc: string[] = [];
	return trip.days.reduce((acc, day: Day): string[] => ([
		...acc,
		...day.itinerary.map((itineraryItem: ItineraryItem): string => (itineraryItem.placeId))
	]), initAcc);
}
