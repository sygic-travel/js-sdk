import {Collection, getCollectionsForDestinationId} from '../Collections';
import {getFavoritesIds} from '../Favorites';
import {
	Category,
	getDetailedPlacesMap,
	getPlacesDestinationMap,
	getPlacesMapFromTrip,
	Level,
	mergePlacesArrays,
	Place
} from '../Places';
import {getRoutesForTripDay, TripDayRoutes} from '../Route';
import {SearchResult, searchReverse} from '../Search';
import {getUserSettings, UserSettings} from '../Session';
import {Day, getTripDetailed, Trip} from '../Trip';
import {sleep} from '../Util';
import * as Dao from './DataAccess';
import {generateDestinationMainMap, generateDestinationSecondaryMaps, generateTripMap} from './MapGenerator';
import {
	GeneratingState,
	PdfData,
	PdfDestination,
	PdfQuery,
	PdfStaticMap,
	PdfStaticMapSector,
	PlaceSource
} from './PdfData';

export {
	GeneratingState,
	PdfData,
	PdfQuery,
	PdfStaticMap,
	PdfStaticMapSector
};

const imageSize: string = '150x120';

const GENERATING_STATE_REFRESH_INTERVAL = 5000; // 5 seconds
const GENERATING_STATE_CHECK_ATTEMPTS = 60;

export async function generatePdf(tripId: string): Promise<GeneratingState> {
	const initState: GeneratingState = await Dao.generatePdf(tripId);
	if (initState.state !== 'generating') {
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

	if (!trip.days) {
		throw new Error('Can\'t generate PDF data for trip without days');
	}

	const routesPromise: Promise<TripDayRoutes[]> = Promise.all(trip.days.map((day: Day, dayIndex: number) => (
		getRoutesForTripDay(trip.id, dayIndex)
	)));

	const placesMapFromTrip: Map<string, Place> = await getPlacesMapFromTrip(trip, imageSize);
	const {
		destinationIdsWithDestinations,
		destinationIdsWithPlaces,
		placeIdsWithPlaceType
	} = await buildDestinationsAndPlaces(placesMapFromTrip);

	const destinationIds: string[] = await getAndFilterDestinationIds(destinationIdsWithPlaces);
	const destinationsPromise: Promise<PdfDestination[]> = Promise.all(destinationIds.map(
		async (destinationId: string) => (
		createDestinationData(
			destinationId,
			await addMissingAddressesToDestinationsPlaces(destinationIdsWithPlaces),
			destinationIdsWithDestinations,
			placeIdsWithPlaceType,
			query
		)
	)));

	const tripMapUrlsPromise = await generateTripMap(trip, query.mainMapWidth, query.mainMapHeight);

	const [
		routes,
		destinations,
		tripStaticMapUrl
	] = await Promise.all([routesPromise, destinationsPromise, tripMapUrlsPromise]);
	return { routes, destinations, tripStaticMapUrl };
}

export async function buildDestinationsAndPlaces(placeIdsAndPlacesFromTrip: Map<string, Place>): Promise<{
	destinationIdsWithDestinations: Map<string, Place>,
	destinationIdsWithPlaces: Map<string, Place[]>,
	placeIdsWithPlaceType: Map<string, PlaceSource>
}> {
	const placeIdsWithDestinations: Map<string, Place> = await getPlacesDestinationMap(
		Array.from(placeIdsAndPlacesFromTrip.keys()),
		imageSize
	);
	const destinationIdsWithDestinations: Map<string, Place> = new Map<string, Place>();
	const destinationIdsWithPlaces: Map<string, Place[]> = new Map<string, Place[]>();
	const placeIdsWithPlaceType: Map<string, PlaceSource> = new Map<string, PlaceSource>();

	placeIdsWithDestinations.forEach((destination: Place, placeId: string) => {
		placeIdsWithPlaceType.set(placeId, PlaceSource.FROM_TRIP);

		if (!destination) {
			return;
		}

		if (destination.level === Level.COUNTRY) {
			return;
		}

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

	const userFavoritesMap: Map<string, Place> = await getDetailedPlacesMap(
		await getFavoritesIds(),
		imageSize
	);

	const favoritesIdsWithDestinations: Map<string, Place> = await getPlacesDestinationMap(
		Array.from(userFavoritesMap.keys()),
		imageSize
	);

	favoritesIdsWithDestinations.forEach((destination: Place, favoriteId: string) => {
		if (destination && destinationIdsWithPlaces.has(destination.id)) {
			if (!placeIdsWithPlaceType.has(favoriteId)) {
				placeIdsWithPlaceType.set(favoriteId, PlaceSource.FROM_FAVORITES);
			}
			const favorite: Place | undefined = userFavoritesMap.get(favoriteId);
			const placesToBeMerged: Place[] | undefined = destinationIdsWithPlaces.get(destination.id);
			destinationIdsWithPlaces.set(destination.id, mergePlacesArrays(
				placesToBeMerged!,
				[favorite!]
			));
		}
	});

	return {
		...await filterUnnecessaryDestinations(destinationIdsWithDestinations, destinationIdsWithPlaces),
		placeIdsWithPlaceType
	};
}

async function createDestinationData(
	destinationId: string,
	destinationIdsWithPlaces: Map<string, Place[]>,
	destinationIdsWithDestinations: Map<string, Place>,
	placeIdsWithPlaceType: Map<string, PlaceSource>,
	query: PdfQuery
): Promise<PdfDestination> {

	const collectionsForDestination: Collection[] = await getCollectionsForDestinationId(destinationId, imageSize);
	const mergedCollectionsAndPlacesFromDestination: Place[] = mergePlacesArrays(
		getSuitableCollectionForDestination(collectionsForDestination),
		destinationIdsWithPlaces.get(destinationId)!
	);

	const placesWihoutTypeSet: Place[] = mergedCollectionsAndPlacesFromDestination.filter((place: Place) => {
		return !placeIdsWithPlaceType.has(place.id);
	});
	placesWihoutTypeSet.forEach((placeWithoutTypeSet: Place) => {
		placeIdsWithPlaceType.set(placeWithoutTypeSet.id, PlaceSource.FROM_COLLECTION);
	});

	destinationIdsWithPlaces.set(destinationId, mergedCollectionsAndPlacesFromDestination);

	const {
		mainMap,
		secondaryMaps
	} = await generateDestinationMaps(mergedCollectionsAndPlacesFromDestination, placeIdsWithPlaceType, query);

	return {
		destination: destinationIdsWithDestinations.get(destinationId)!,
		places: destinationIdsWithPlaces.get(destinationId)!,
		placeSources: placeIdsWithPlaceType,
		mainMap,
		secondaryMaps
	} as PdfDestination;
}

function getSuitableCollectionForDestination(collectionsForDestination: Collection[]): Place[] {
	if (collectionsForDestination.length === 0) {
		return [];
	}

	let collectionPlaces: Place[] = [];
	collectionsForDestination.forEach((collectionForDestination: Collection) => {
		// if collection has no tags => top POIs in collection
		if (collectionForDestination.tags.length === 0) {
			collectionPlaces = collectionsForDestination[0].places;
		}
	});

	return collectionPlaces;
}

async function generateDestinationMaps(
	destinationPlaces: Place[],
	placeIdsWithPlaceType: Map<string, PlaceSource>,
	query: PdfQuery
): Promise<{
	mainMap: PdfStaticMap,
	secondaryMaps: PdfStaticMap[]
}> {
	const mainMap: PdfStaticMap = await generateDestinationMainMap(destinationPlaces, placeIdsWithPlaceType, query);
	const sectorsForSecondaryMaps: PdfStaticMapSector[] = mainMap.sectors.filter((sector: PdfStaticMapSector) => {
		return sector.places.length > 3;
	});
	const secondaryMaps: PdfStaticMap[] = await generateDestinationSecondaryMaps(
		destinationPlaces,
		query,
		sectorsForSecondaryMaps,
		placeIdsWithPlaceType
	);
	return { mainMap, secondaryMaps };
}

async function getHomeDestinationId(homePlaceId: string | null): Promise<string | null> {
	if (!homePlaceId) {
		return null;
	}

	const homeDestinationMap: Map<string, Place> = await getPlacesDestinationMap([homePlaceId], imageSize);
	const homeDestination: Place | undefined = homeDestinationMap.get(homePlaceId);
	return homeDestination ? homeDestination.id : null;
}

async function filterUnnecessaryDestinations(
	destinationIdsWithDestinations: Map<string, Place>,
	destinationIdsWithPlaces: Map<string, Place[]>
): Promise<{
	destinationIdsWithDestinations: Map<string, Place>,
	destinationIdsWithPlaces: Map<string, Place[]>
}> {
	const userSettings: UserSettings = await getUserSettings();
	const homeDestinationId: string | null = await getHomeDestinationId(userSettings.homePlaceId);
	const homeDestinationPlaces: Place[] | undefined = homeDestinationId ?
		destinationIdsWithPlaces.get(homeDestinationId) : undefined;

	if (destinationIdsWithDestinations.size === 1 && homeDestinationPlaces) {
		return { destinationIdsWithDestinations, destinationIdsWithPlaces };
	}

	if (homeDestinationId && homeDestinationPlaces && homeDestinationPlaces!.length > 0) {
		destinationIdsWithDestinations.delete(homeDestinationId);
		destinationIdsWithPlaces.delete(homeDestinationId);
	}

	return { destinationIdsWithDestinations, destinationIdsWithPlaces };
}

async function addMissingAddressesToDestinationsPlaces(
	destinationIdsWithPlaces: Map<string, Place[]>
): Promise<Map<string, Place[]>> {
	const destinationIds: string[] = Array.from(destinationIdsWithPlaces.keys());
	await Promise.all(destinationIds.map(async (destinationId) => {
		const destinationPlaces: Place[] | undefined = destinationIdsWithPlaces.get(destinationId);
		if (destinationPlaces) {
			destinationIdsWithPlaces.set(destinationId, await findAndSetMissingAddresses(destinationPlaces));
		}
	}));
	return destinationIdsWithPlaces;
}

async function getAndFilterDestinationIds(destinationIdsWithPlaces: Map<string, Place[]>): Promise<string[]> {
	const destinationIds: string[] = [];
	destinationIdsWithPlaces.forEach((places: Place[], destinationId: string) => {
		const areAllPlacesTraveling = places.every(place => place.categories.indexOf(Category.TRAVELING) !== -1);
		if (areAllPlacesTraveling) {
			return;
		}
		destinationIds.push(destinationId);
	});
	return destinationIds;
}

export async function findAndSetMissingAddresses(places: Place[]): Promise<Place[]> {
	return Promise.all(places.map(async (place: Place) => {
		if (place.level === Level.POI && place.detail && !place.detail.address) {
			let searchResult: SearchResult[] = [];
			try {
				searchResult = await searchReverse(place.location);
				if (searchResult.length > 0 && searchResult[0].address) {
					place.detail.address = searchResult[0].address!.short;
				}
			} catch (e) {
				place.detail.address = null;
			}
		}
		return place;
	}));
}
