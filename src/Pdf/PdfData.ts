import { Bounds, Location } from '../Geo';
import { Place } from '../Places';
import { TripDayRoutes } from '../Route';

export interface PdfQuery {
	tripId: string;
	mainMapWidth: number;
	mainMapHeight: number;
	gridRowsCount: number;
	gridColumnsCount: number;
	secondaryMapWidth: number;
	secondaryMapHeight: number;
}

export interface PdfData {
	destinations: PdfDestination[];
	routes: TripDayRoutes[];
}

export interface PdfDestination {
	destination: Place;
	mainMap: StaticMap|null;
	secondaryMaps: StaticMap[];
	places: Place[];
}

export interface StaticMapSector {
	id: string;
	bounds: Bounds;
	places: Place[];
}

export interface StaticMap {
	id: string;
	url: string;
	bounds: Bounds;
	sectors: StaticMapSector[];
}

export interface StaticMapPoint extends Location {
	image?: string;
}
