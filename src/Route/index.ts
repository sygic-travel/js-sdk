import { Location, NamedLocation } from '../Geo';
import { Dao as placesDao, Place } from '../Places';
import { Dao as tripsDao, Day, ItineraryItem, TransportAvoid, TransportMode, TransportSettings, Trip } from '../Trip';
import { buildDateTimeWithSecondsFromMidnight } from '../Util';
import * as Dao from './DataAccess';
import * as Mapper from './Mapper';
import {
	Direction, DirectionSendResponseCode, DirectionSource, ModeDirections, Route,
	RouteRequest, TripDayRoutes, Waypoint
} from './Route';

export {
	Direction,
	DirectionSendResponseCode,
	DirectionSource,
	ModeDirections,
	Route,
	RouteRequest,
	Mapper,
	TripDayRoutes,
	Waypoint
};

export async function sendDirections(
	email: string,
	destination: NamedLocation,
	origin?: NamedLocation,
	waypoints?: Waypoint[],
	avoid?: TransportAvoid[],

): Promise<DirectionSendResponseCode> {
	return Dao.sendDirections(email, destination, origin, waypoints, avoid);
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

	const places: Place[] = await placesDao.getPlacesFromTripDay(day, '100x100');
	const userTransportSettings: (TransportSettings | null)[] = day.itinerary.slice(1)
		.map((item: ItineraryItem) => item.transportFromPrevious);
	let routes: Route[] = await Dao.getRoutes(createRequests(places, day));
	routes = routes.map((route: Route, index: number): Route => {
		if (!userTransportSettings[index]) {
			return route;
		}

		const chosenModeDirection: ModeDirections = route.modeDirections.find((modeDirection: ModeDirections) => (
			modeDirection.mode === userTransportSettings[index]!.mode
		))!;

		const chosenDirection: Direction | undefined = chosenModeDirection.directions.find((direction: Direction) => (
			direction.routeId === userTransportSettings[index]!.routeId
		));

		route.chosenDirection = chosenDirection ? chosenDirection : chosenModeDirection.directions[0];

		return route;
	});
	return {
		routes,
		userTransportSettings
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
				currentItem.transportFromPrevious.routeId,
				buildTransportStartTime(day.date, currentItem.transportFromPrevious.startTime),
				currentItem.transportFromPrevious.waypoints,
				currentItem.transportFromPrevious.avoid,
			));
		} else {
			requests.push(Mapper.createRouteRequest(
				currentPlace.location,
				previousPlace.location,
				null,
				buildTransportStartTime(day.date, null)
			));
		}

		return requests;
	}, []);
};

function buildTransportStartTime(date: string | null, transportStartTime: number | null): string | null {
	if (!date) {
		return null;
	}

	if (!transportStartTime) {
		return buildDateTimeWithSecondsFromMidnight(date, 36000);
	}

	return buildDateTimeWithSecondsFromMidnight(date, transportStartTime);
}

export async function getDirections(
	origin: Location,
	destination: Location,
	waypoints: Waypoint[],
	avoids: TransportAvoid[],
	at?: string | null
): Promise<Route | null> {
	const routes: Route[] = await Dao.getRoutes([Mapper.createRouteRequest(
		destination,
		origin,
		null,
		at ? at : null,
		waypoints,
		avoids,
	)]);
	return routes.length > 0 ? routes[0] : null;
}
