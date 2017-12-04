import { Collection, getCollectionsForDestinationId } from '../Collections';
import { getPlacesDestinationMap, getPlacesMapFromTrip, mergePlacesArrays, Place } from '../Places';
import { getRoutesForTripDay, TripDayRoutes } from '../Route';
import { Day, getTripDetailed, Trip } from '../Trip';
import { getUserSettings, UserSettings } from '../User';
import { sleep } from '../Util';
import * as Dao from './DataAccess';
import { generateDestinationMainMap, generateDestinationSecondaryMaps } from './MapGenerator';
import { GeneratingState, PdfData, PdfQuery, PdfStaticMap, PdfStaticMapSector } from './PdfData';

export {
	GeneratingState,
	PdfData,
	PdfQuery,
	PdfStaticMap,
	PdfStaticMapSector
};

const GENERATING_STATE_REFRESH_INTERVAL = 5000; // 5 seconds
const GENERATING_STATE_CHECK_ATTEMPTS = 60;

export async function generatePdf(tripId: string): Promise<GeneratingState> {
	const initState: GeneratingState = await Dao.generatePdf(tripId);
	if (initState.state !== 'generating' ) {
		return initState;
	}
	let checkCount = 0;
	while (checkCount < GENERATING_STATE_CHECK_ATTEMPTS) {
		checkCount++;
		await sleep(GENERATING_STATE_REFRESH_INTERVAL);
		const state: GeneratingState = await Dao.getGeneratingState(tripId, initState.generatingId);
		if (state.state !== 'generating') {
			return state;
		}
	}
	return {
		generatingId: initState.generatingId,
		state: 'timeout',
		url: null
	} as GeneratingState;
}

export async function getPdfData(query: PdfQuery): Promise<PdfData> {
	const trip: Trip = await getTripDetailed(query.tripId);
	const pdfData: PdfData = {
		destinations: [],
		routes: []
	};

	if (!trip.days) {
		throw new Error('Can\'t generate PDF data for trip without days');
	}

	const routesPromise: Promise<TripDayRoutes[]> = Promise.all(trip.days.map((day: Day, dayIndex: number) => (
		getRoutesForTripDay(trip.id, dayIndex)
	)));

	const placesMapFromTrip: Map<string, Place> = await getPlacesMapFromTrip(trip);
	const {
		destinationIdsWithDestinations,
		destinationIdsWithPlaces
	} = await buildDestinationsAndPlaces(placesMapFromTrip);

	const homeDestinationId: string|null = await getHomeDestinationId();
	if (homeDestinationId)  {
		destinationIdsWithDestinations.delete(homeDestinationId);
		destinationIdsWithPlaces.delete(homeDestinationId);
	}

	const destinationIds: string[] = Array.from(destinationIdsWithPlaces.keys());

	const destinationsPromise: Promise<void[]> = Promise.all(destinationIds.map(async (destinationId: string) => {
		const collectionsForDestination: Collection[] = await getCollectionsForDestinationId(destinationId);
		const mergedCollectionsAndPlacesFromDestination: Place[] = mergePlacesArrays(
			collectionsForDestination.length > 0 ? collectionsForDestination[0].places : [],
			destinationIdsWithPlaces.get(destinationId)!
		);

		destinationIdsWithPlaces.set(destinationId, mergedCollectionsAndPlacesFromDestination);

		const {
			mainMap,
			secondaryMaps
		} = await generateDestinationMaps(mergedCollectionsAndPlacesFromDestination, query);

		pdfData.destinations.push({
			destination: destinationIdsWithDestinations.get(destinationId)!,
			places: destinationIdsWithPlaces.get(destinationId)!,
			mainMap,
			secondaryMaps
		});
	}));

	const [routes] = await Promise.all([routesPromise, destinationsPromise]);
	pdfData.routes = routes;

	return pdfData;
}

export async function buildDestinationsAndPlaces(placeIdsAndPlacesFromTrip: Map<string, Place>): Promise<{
	destinationIdsWithDestinations: Map<string, Place>,
	destinationIdsWithPlaces: Map<string, Place[]>
}> {
	const placeIdsWithDestinations: Map<string, Place> = await getPlacesDestinationMap(
		Array.from(placeIdsAndPlacesFromTrip.keys())
	);
	const destinationIdsWithDestinations: Map<string, Place> = new Map<string, Place>();
	const destinationIdsWithPlaces: Map<string, Place[]> = new Map<string, Place[]>();

	placeIdsWithDestinations.forEach((destination: Place, placeId: string) => {
		if (!destinationIdsWithDestinations.has(destination.id)) {
			destinationIdsWithDestinations.set(destination.id, destination);
		}

		if (destinationIdsWithPlaces.has(destination.id)) {
			const placesInDestination: Place[] = destinationIdsWithPlaces.get(destination.id)!;
			placesInDestination.push(placeIdsAndPlacesFromTrip.get(placeId)!);
			destinationIdsWithPlaces.set(destination.id, placesInDestination);
		} else {
			destinationIdsWithPlaces.set(destination.id, [placeIdsAndPlacesFromTrip.get(placeId)!]);
		}
	});

	return { destinationIdsWithDestinations, destinationIdsWithPlaces };
}

async function generateDestinationMaps(destinationPlaces: Place[], query: PdfQuery): Promise<{
	mainMap: PdfStaticMap,
	secondaryMaps: PdfStaticMap[]
}> {
	const mainMap: PdfStaticMap = await generateDestinationMainMap(destinationPlaces, query);
	const sectorsForSecondaryMaps: PdfStaticMapSector[] = mainMap.sectors.filter((sector: PdfStaticMapSector) => {
		return sector.places.length > 5;
	});
	const secondaryMaps: PdfStaticMap[] = await generateDestinationSecondaryMaps(
		destinationPlaces,
		query,
		sectorsForSecondaryMaps
	);
	return { mainMap, secondaryMaps };
}

async function getHomeDestinationId(): Promise<string|null> {
	const userSettings: UserSettings = await getUserSettings();

	if (!userSettings.homePlaceId) {
		return null;
	}

	const homeDestinationMap: Map<string, Place> = await getPlacesDestinationMap([userSettings.homePlaceId]);
	const homeDestination: Place|undefined = homeDestinationMap.get(userSettings.homePlaceId);
	return homeDestination ? homeDestination.id : null;
}
