import { Collection, getCollectionsForDestinationId } from '../Collections';
import { getPlacesDestinationMap, getPlacesMapFromTrip, mergePlacesArrays, Place } from '../Places';
import { getRoutesForTripDay } from '../Route';
import { Day, getTripDetailed, Trip } from '../Trip';
import { generateDestinationMainMap, generateDestinationSecondaryMaps } from './MapGenerator';
import { PdfData, PdfQuery, StaticMap, StaticMapSector } from './PdfData';

export async function getPdfData(query: PdfQuery): Promise<PdfData> {
	const trip: Trip = await getTripDetailed(query.tripId);
	const pdfData: PdfData = {
		destinations: [],
		routes: []
	};

	if (!trip.days) {
		return pdfData;
	}

	const placesMapFromTrip: Map<string, Place> = await getPlacesMapFromTrip(trip);
	const {
		destinationIdsWithDestinations,
		destinationIdsWithPlaces
	} = await buildDestinationsAndPlaces(placesMapFromTrip);

	const destinationIds: string[] = Array.from(destinationIdsWithPlaces.keys());

	Promise.all(destinationIds.map(async (destinationId: string) => {
		const collectionsForDestination: Collection[] = await getCollectionsForDestinationId(destinationId);
		const mergedCollectionsAndPlacesFromDestination: Place[] = mergePlacesArrays(
			collectionsForDestination[0].places,
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

	pdfData.routes = await Promise.all(trip.days.map((day: Day, dayIndex: number) => (
		getRoutesForTripDay(trip.id, dayIndex)
	)));

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
	mainMap: StaticMap,
	secondaryMaps: StaticMap[]
}> {
	const mainMap: StaticMap = await generateDestinationMainMap(destinationPlaces, query);
	const sectorsForSecondaryMaps: StaticMapSector[] = mainMap.sectors.filter((sector: StaticMapSector) => {
		return sector.places.length > 5;
	});
	const secondaryMaps: StaticMap[] = await generateDestinationSecondaryMaps(
		destinationPlaces,
		query,
		sectorsForSecondaryMaps
	);
	return { mainMap, secondaryMaps };
}
