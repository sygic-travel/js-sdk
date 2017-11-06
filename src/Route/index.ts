import { Location } from '../Geo';
import { Dao as placesDao, Place } from '../Places';
import { Dao as tripsDao, Day, ItineraryItem, TransportAvoid, Trip } from '../Trip';
import * as Dao from './DataAccess';
import * as Mapper from './Mapper';
import * as ModeSelector from './ModeSelector';
import { Direction, DirectionSource, ModeDirections, Route, RouteRequest, TripDayRoutes, Waypoint } from './Route';

export {
	Direction,
	DirectionSource,
	ModeDirections,
	ModeSelector,
	Route,
	RouteRequest,
	Mapper,
	TripDayRoutes,
	Waypoint
}

export async function getRoutesForTripDay(tripId: string, dayIndex: number): Promise<TripDayRoutes>  {
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
	return {
		routes: filterRoutesDirections(routes),
		userTransportSettings: day.itinerary.slice(1).map(
			(item: ItineraryItem) => (item.transportFromPrevious)
		)
	} as TripDayRoutes;
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

		if (currentItem.transportFromPrevious) {
			requests.push(Mapper.createRouteRequest(
				currentPlace.location,
				previousPlace.location,
				currentItem.transportFromPrevious.waypoints,
				currentItem.transportFromPrevious.avoid,
				currentItem.transportFromPrevious.mode
			));
		} else {
			requests.push(Mapper.createRouteRequest(currentPlace.location, previousPlace.location));
		}

		return requests;
	}, []);
};

export async function getDirections(
	origin: Location,
	destination: Location,
	waypoints: Waypoint[],
	avoids: TransportAvoid[]
): Promise<Route | null> {
	let routes: Route[] = await Dao.getRoutes([Mapper.createRouteRequest(destination, origin, waypoints, avoids)]);
	routes = filterRoutesDirections(routes);
	return routes.length > 0 ? routes[0] : null;
}

const filterRoutesDirections = (routes: Route[]): Route[] => {
	return routes.map((route: Route): Route => {
		const availableModes = ModeSelector.getAvailableModes(route.origin, route.destination);
		route.modeDirections = route.modeDirections.filter((modeDirection: ModeDirections) => {
			return availableModes.indexOf(modeDirection.mode) !== -1;
		});
		return route;
	});
};
