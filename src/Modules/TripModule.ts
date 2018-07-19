import {
	applyTripTemplate,
	cloneTrip,
	emptyTripsTrash,
	ensureTripSyncedToServer,
	getNearestPossiblePlace,
	getTripDetailed,
	getTripEditor,
	getTripIdsWaitingToSync,
	getTrips,
	getTripsInTrash,
	getTripTemplates,
	saveTrip,
	Trip,
	TripEditor,
	TripInfo,
	TripTemplate,
} from '../Trip';

/**
 * @experimental
 */
export default class TripModule {
	public getTrips(dateFrom?: string | null, dateTo?: string | null): Promise<TripInfo[]> {
		return getTrips(dateFrom, dateTo);
	}

	public getTripsInTrash(): Promise<TripInfo[]> {
		return getTripsInTrash();
	}

	public getTripDetailed(id: string): Promise<Trip> {
		return getTripDetailed(id);
	}

	public getTripEditor(): TripEditor {
		return getTripEditor();
	}

	public saveTrip(trip: Trip): Promise<Trip> {
		return saveTrip(trip);
	}

	public cloneTrip(id): Promise<string> {
		return cloneTrip(id);
	}

	public ensureTripSyncedToServer(tripId: string): Promise<void> {
		return ensureTripSyncedToServer(tripId);
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

	public getTripIdsWaitingToSync = getTripIdsWaitingToSync;
	public getNearestPossiblePlace = getNearestPossiblePlace;
}
