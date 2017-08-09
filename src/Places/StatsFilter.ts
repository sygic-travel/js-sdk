import { locationToMapTileKey } from '../Geo';
import { PlacesFilter, PlacesFilterJSON, PlacesFilterQuery } from './Filter';

export interface PlacesStatsFilterJSON extends PlacesFilterJSON {
	mapTileBounds?: string[];
}

export interface PlacesStatsFilterQuery extends PlacesFilterQuery {
	map_tile_bounds?: string;
}

export class PlacesStatsFilter extends PlacesFilter {
	private _mapTileBounds?: string[];

	constructor(placesFilter: PlacesStatsFilterJSON) {
		super(placesFilter);
		this._mapTileBounds = placesFilter.mapTileBounds;
		this.validate();
	}

	public switchBoundsToMapTileBounds(): PlacesStatsFilter {
		const that = Object.create(this);
		if (!this._bounds || !this._zoom) {
			return Object.assign(that, this, {_mapTileBounds: null});
		}
		const swMapTile = locationToMapTileKey({lat: this._bounds.south, lng: this._bounds.west}, this._zoom);
		const neMapTile = locationToMapTileKey({lat: this._bounds.north, lng: this._bounds.east}, this._zoom);
		return Object.assign(that, this, {_bounds: null, _mapTileBounds: [swMapTile, neMapTile]});
	}

	public toQueryObject(): PlacesStatsFilterQuery {
		const queryObject: PlacesStatsFilterQuery = super.toQueryObject();
		if (this._mapTileBounds) {
			queryObject.map_tile_bounds = this._mapTileBounds.join(',');
		}
		return queryObject;
	}

	protected validate(): void {
		super.validate();
		if (this._bounds) {
			if (!this._zoom) {
				throw new Error('Zoom must be specified when calling with bounds.');
			}
		}
	}
}
