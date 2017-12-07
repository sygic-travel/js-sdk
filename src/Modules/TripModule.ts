import * as Settings from '../Settings';
import {
	addDaysToTrip,
	addPlaceToDay,
	addSequenceToDay,
	applyTripTemplate,
	cloneTrip,
	createTrip,
	emptyTripsTrash,
	getTripDetailed,
	getTrips,
	getTripsInTrash,
	getTripTemplates,
	movePlaceInDay,
	removeAllPlacesFromDay,
	removeDayFromTrip,
	removePlacesFromDay,
	setOvernightPlace,
	setTransport,
	swapDaysInTrip,
	TransportSettings,
	Trip,
	TripConflictHandler,
	TripTemplate,
	TripUpdateData,
	updateDayNote,
	updateItineraryItemUserData,
	updateTrip
} from '../Trip';

/**
 * @experimental
 */
export default class TripModule {
	public getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<Trip[]> {
		return getTrips(dateFrom, dateTo);
	}

	public getTripsInTrash(): Promise<Trip[]> {
		return getTripsInTrash();
	}

	public getTripDetailed(id: string): Promise<Trip> {
		return getTripDetailed(id);
	}

	public createTrip(startDate: string, name: string, placeId: string): Promise<Trip> {
		return createTrip(startDate, name, placeId);
	}

	public updateTrip(id, dataToUpdate: TripUpdateData): Promise<Trip> {
		return updateTrip(id, dataToUpdate);
	}

	public cloneTrip(id): Promise<string> {
		return cloneTrip(id);
	}

	public addDaysToTrip(id: string, appendCount: number, prependCount: number): Promise<Trip> {
		return addDaysToTrip(id, appendCount, prependCount);
	}

	public removeDayFromTrip(id: string, dayIndex: number): Promise<Trip> {
		return removeDayFromTrip(id, dayIndex);
	}

	public swapDaysInTrip(id: string, firstDayIndex: number, secondDayIndex: number): Promise<Trip> {
		return swapDaysInTrip(id, firstDayIndex, secondDayIndex);
	}

	public movePlaceInDay(id: string, dayIndex: number, positionFrom: number, positionTo: number): Promise<Trip> {
		return movePlaceInDay(id, dayIndex, positionFrom, positionTo);
	}

	public removePlacesFromDay(id: string, dayIndex: number, positionsInDay: number[]): Promise<Trip> {
		return removePlacesFromDay(id, dayIndex, positionsInDay);
	}

	public removeAllPlacesFromDay(id: string, dayIndex: number): Promise<Trip> {
		return removeAllPlacesFromDay(id, dayIndex);
	}

	public addPlaceToDay(
		tripId: string,
		placeId: string,
		dayIndex: number,
		positionInDay?: number): Promise<Trip> {
		return addPlaceToDay(tripId, placeId, dayIndex, positionInDay);
	}

	public addSequenceToDay(
		tripId: string,
		dayIndex: number,
		placeIds: string[],
		transports?: (TransportSettings|null)[],
		positionInDay?: number
	): Promise<Trip> {
		return addSequenceToDay(tripId, dayIndex, placeIds, transports, positionInDay);
	}

	public setOvernightPlace(
		tripId: string,
		placeId: string,
		dayIndexes: number[]): Promise<Trip> {
		return setOvernightPlace(tripId, placeId, dayIndexes);
	}

	public setTransport(id: string, dayIndex: number, itemIndex: number, settings: TransportSettings): Promise<Trip> {
		return setTransport(id, dayIndex, itemIndex, settings);
	}

	public setTripConflictHandler(
		handler: null | TripConflictHandler
	): void {
		Settings.setTripConflictHandler(handler);
	}

	public emptyTripsTrash(): Promise<string[]> {
		return emptyTripsTrash();
	}

	public getTripTemplates(placeId: string): Promise<TripTemplate[]> {
		return getTripTemplates(placeId);
	}

	public applyTripTemplate(tripId: string, templateId: number, dayIndex: number): Promise<Trip> {
		return applyTripTemplate(tripId, templateId, dayIndex);
	}

	public updateItineraryItemUserData(
		id: string,
		dayIndex: number,
		itemIndex: number,
		startTime: number | null,
		duration: number | null,
		note: string | null,
	): Promise<Trip> {
		return updateItineraryItemUserData(id, dayIndex, itemIndex, startTime, duration, note);
	}

	public updateDayNote(tripId: string, dayIndex: number, note: string): Promise<Trip> {
		return updateDayNote(tripId, dayIndex, note);
	}
}
