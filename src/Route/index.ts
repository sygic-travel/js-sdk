import { Dao as placesDao, Place } from '../Places';
import { Dao as tripsDao, Day, ItineraryItem, Trip } from '../Trip';
import * as Dao from './DataAccess';
import * as Mapper from './Mapper';
import * as ModeSelector from './ModeSelector';
import { Direction, DirectionSource, ModeDirections, Route, RouteRequest } from './Route';

export {
	Direction,
	DirectionSource,
	ModeDirections,
	ModeSelector,
	Route,
	RouteRequest,
	Mapper,
}

export async function getRoutesForTripDay(tripId: string, dayIndex: number): Promise<Route[]>  {
	const trip: Trip = await tripsDao.getTripDetailed(tripId);
	if (trip === null) {
		throw new Error('Trip not found.');
	}

	let day: Day;
	if (trip.days && trip.days[dayIndex]) {
		day = trip.days[dayIndex];
	} else {
		throw new Error('Trip does not have day on index ' + dayIndex);
	}

	const places: Place[] = await placesDao.getPlacesFromTripDay(day);
	const routes: Route[] = await Dao.getRoutes(createRequests(places, day));
	return routes.map((route: Route): Route => {
		const availableModes = ModeSelector.getAvailableModes(route.origin, route.destination);
		route.modeDirections = route.modeDirections.filter((modeDirection: ModeDirections) => {
			return availableModes.indexOf(modeDirection.mode) !== -1;
		});
		return route;
	});
}

const createRequests = (places: Place[], day: Day): RouteRequest[] => {
	return day.itinerary.reduce((requests: RouteRequest[], currentItem: ItineraryItem, index: number) => {
		if (!index) {
			return requests;
		}
		const previousItem: ItineraryItem = day.itinerary[index - 1];
		const previousPlace = places.find((place: Place) => (place.id === previousItem.placeId));
		const currentPlace = places.find((place: Place) => (place.id === currentItem.placeId));
		if (!currentPlace || !previousPlace) {
			throw new Error('Place not found!');
		}
		requests.push(Mapper.createRouteRequest(currentItem, currentPlace.location, previousPlace.location));
		return requests;
	}, []);
};
