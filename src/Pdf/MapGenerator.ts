import { Bounds, isLocationInBounds, Location } from '../Geo';
import { Place } from '../Places';
import { Day, ItineraryItem, Trip } from '../Trip';
import { getStaticMap } from './DataAccess';
import { PdfQuery, PdfStaticMap, PdfStaticMapSector, PlaceSource, StaticMap, StaticMapPoint } from './PdfData';

export async function generateDestinationMainMap(
	destinationPlaces: Place[],
	placeIdsWithPlaceType: Map<string, PlaceSource>,
	query: PdfQuery
): Promise<PdfStaticMap> {
	const staticMap: StaticMap = await getStaticMap(
		query.mainMapWidth,
		query.mainMapHeight,
		destinationPlaces.map((place: Place) => {
			const placeSource: PlaceSource | undefined = placeIdsWithPlaceType.get(place.id);
			let markerUrl = 'http://a.twobits.cz/i/1x/o/dot.png'; // marker for place from collection
			if (placeSource === PlaceSource.FROM_TRIP) {
				markerUrl = 'http://a.twobits.cz/i/1x/b/dot.png'; // marker for place from trip
			} else if (placeSource === PlaceSource.FROM_FAVORITES) {
				markerUrl = 'http://a.twobits.cz/i/1x/r/dot.png'; // // marker for place from favorites
			}

			return {
				...place.location,
				image: markerUrl
			};
		})
	);

	let sectors: PdfStaticMapSector[] = calculateMapGrid(
		staticMap.bounds,
		query.gridColumnsCount,
		query.gridRowsCount
	);

	sectors.forEach((sector: PdfStaticMapSector) => {
		sector.places = destinationPlaces.filter((place: Place) => (
			isLocationInBounds(place.location, sector.bounds)
		));
	});

	// delete sectors without places
	sectors = sectors.filter((sector: PdfStaticMapSector) => {
		return sector.places.length > 0;
	});

	return {
		...staticMap,
		id: 'main',
		sectors
	};
}

export async function generateDestinationSecondaryMaps(
	destinationPlaces: Place[],
	query: PdfQuery,
	sectorsForSecondaryMaps: PdfStaticMapSector[],
): Promise<PdfStaticMap[]> {
	return Promise.all(sectorsForSecondaryMaps.map(async (sector: PdfStaticMapSector) => {
		const sectorPlaces: Place[] = sector!.places.map((sectorPlace: Place) => {
			const place: Place | undefined = destinationPlaces.find((p: Place) => p.id === sectorPlace.id);
			return place!;
		});

		let staticMap: StaticMap;

		if (sectorPlaces.length > 50) {
			staticMap = {
				url: '',
				bounds: {
					south: 0,
					north: 0,
					east: 0,
					west: 0
				}
			};
		} else {
			staticMap = await getStaticMap(
				query.secondaryMapWidth,
				query.secondaryMapHeight,
				sectorPlaces.map((place: Place, index: number) => ({
					lat: place.location.lat,
					lng: place.location.lng,
					image: `http://a.twobits.cz/i/1x/b/${index + 1}.png`
				}))
			);
		}

		return {
			...staticMap,
			id: sector!.id,
			sectors: [],
		};
	}));
}

export function calculateMapGrid(generatedMapsBounds: Bounds, columnsCount, rowsCount): PdfStaticMapSector[] {
	const zeroPoint: Location = {
		lat: generatedMapsBounds.north,
		lng: generatedMapsBounds.west
	};

	const sectorWidth: number = (generatedMapsBounds.east - generatedMapsBounds.west) / columnsCount;
	const sectorHeight: number = (generatedMapsBounds.north - generatedMapsBounds.south) / rowsCount;

	const mapGrid: PdfStaticMapSector[]  = [];

	for (let i = 0; i < rowsCount; i++) {
		for (let j = 0; j < columnsCount; j++) {
			const sectorBounds: Bounds = {
				south: zeroPoint.lat - ((i + 1) * sectorHeight),
				west: zeroPoint.lng + (j * sectorWidth),
				north: zeroPoint.lat - (i * sectorHeight),
				east: zeroPoint.lng + ((j + 1) * sectorWidth)
			};

			mapGrid.push({
				id: String.fromCharCode(97 + i).toUpperCase() + j.toString(),
				bounds: sectorBounds,
				places: []
			});
		}
	}

	return mapGrid;
}

export const generateTripMap = async (trip: Trip, width: number, height: number): Promise<string> => {
	const staticMap: StaticMap = await getStaticMap(
		width,
		height,
		trip.days.reduce((placeLocations: StaticMapPoint[], day: Day) => {
			placeLocations = placeLocations.concat(day.itinerary!.map((itineraryItem: ItineraryItem) => ({
				lat: itineraryItem.place!.location.lat,
				lng: itineraryItem.place!.location.lng
			})));
			return placeLocations;
		}, [])
	);
	return staticMap.url;
};
