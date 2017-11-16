import { Bounds, calculateLocationsBounds, isLocationInBounds, Location } from '../Geo';
import { Place } from '../Places';
import { getStaticMap } from './DataAccess';
import { PdfQuery, StaticMap, StaticMapSector } from './PdfData';

export async function generateDestinationMainMap(
	destinationPlaces: Place[],
	query: PdfQuery
): Promise<StaticMap> {
	const destinationPlacesLocations: Location[] = destinationPlaces.map((place: Place) => place.location);
	const mainMap: StaticMap = await getStaticMap(
		'main',
		query.mainMapWidth,
		query.mainMapHeight,
		destinationPlacesLocations,
		calculateLocationsBounds(destinationPlacesLocations)
	);

	mainMap.sectors = calculateMapGrid(
		mainMap.bounds,
		query.gridColumnsCount,
		query.gridRowsCount
	);

	mainMap.sectors.forEach((sector: StaticMapSector) => {
		sector.places = destinationPlaces.filter((place: Place) => (
			isLocationInBounds(place.location, sector.bounds)
		));
	});

	// delete sectors without places
	mainMap.sectors = mainMap.sectors.filter((sector: StaticMapSector) => {
		return sector.places.length > 0;
	});

	return mainMap;
}

export async function generateDestinationSecondaryMaps(
	destinationPlaces: Place[],
	query: PdfQuery,
	sectorsForSecondaryMaps: StaticMapSector[],
): Promise<StaticMap[]> {
	return await Promise.all(sectorsForSecondaryMaps.map(async (sector: StaticMapSector) => {
		const sectorPlaces: Place[] = sector!.places.map((sectorPlace: Place) => {
			const place: Place|undefined = destinationPlaces.find((p: Place) => p.id === sectorPlace.id);
			return place!;
		});
		return await getStaticMap(
			sector!.id,
			query.secondaryMapWidth,
			query.secondaryMapHeight,
			sectorPlaces.map((place: Place, index: number) => ({
				lat: place.location.lat,
				lng: place.location.lng,
				image: `http://a.twobits.cz/i/1x/b/${index + 1}.png`
			})),
			calculateLocationsBounds(sectorPlaces.map((p: Place) => p.location))
		);
	}));
}

export function calculateMapGrid(generatedMapsBounds: Bounds, columnsCount, rowsCount): StaticMapSector[] {
	const zeroPoint: Location = {
		lat: generatedMapsBounds.north,
		lng: generatedMapsBounds.west
	};

	const sectorWidth: number = (generatedMapsBounds.east - generatedMapsBounds.west) / columnsCount;
	const sectorHeight: number = (generatedMapsBounds.north - generatedMapsBounds.south) / rowsCount;

	const mapGrid: StaticMapSector[]  = [];

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
