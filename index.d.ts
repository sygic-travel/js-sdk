import * as _Geo from './src/Geo';
import * as _Media from './src/Media/Media';
import * as _PlacesFilter from './src/Places/Filter';
import * as _Place from './src/Places/Place';
import * as _PlaceDetail from './src/Places/PlaceDetail';
import * as _Spread from './src/Spread';

export function create(apiUrl: string, clientKey: string): StSDK;

export interface StSDK {
	getPlaces(filter: _PlacesFilter.PlacesFilterJSON): Promise<_Place.Place[]>;
	getPlaceDetailed(guid: string, photoSize: string): Promise<_Place.Place>;
	getPlaceMedia(guid: string): Promise<_Media.Medium[]>;
	spreadPlacesOnMap(
		places: _Place.Place[],
		markerSizes: _Spread.SpreadSizeConfig[],
		bounds: _Geo.Bounds,
		canvas: _Spread.CanvasSize
	): _Spread.SpreadResult;
}

export namespace Places {
	export import Place = _Place.Place;
	export import PlacesFilterJSON = _PlacesFilter.PlacesFilterJSON;
	export import Price = _Place.Price;
	export import PlaceDetail = _PlaceDetail.PlaceDetail;
	export import Reference = _PlaceDetail.Reference;
	export import Tag = _PlaceDetail.Tag;
	export import Description = _PlaceDetail.Description;
}

export namespace Geo {
	export import Bounds = _Geo.Bounds;
	export import Location = _Geo.Location;
	export import Coordinate = _Geo.Coordinate;
}

export namespace Media {
	export import MainMedia = _Media.MainMedia;
	export import Medium = _Media.Medium;
	export import Attribution = _Media.Attribution;
	export import Source = _Media.Source;
	export import Original = _Media.Original;
}

export namespace Spread {
	export import SpreadSizeConfig = _Spread.SpreadSizeConfig;
	export import CanvasSize = _Spread.CanvasSize;
	export import SpreadResult = _Spread.SpreadResult;
	export import SpreadedPlace = _Spread.SpreadedPlace;
}
