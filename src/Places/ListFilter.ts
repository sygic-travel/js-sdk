import { Bounds, Location } from '../Geo';
import { PlacesFilter, PlacesFilterJSON, PlacesFilterQuery } from './Filter';

export interface PlacesListFilterJSON extends PlacesFilterJSON {
	mapSpread?: number;
	limit?: number;
	location?: Location;
}

export interface PlacesListFilterQuery extends PlacesFilterQuery {
	map_spread?: number;
	limit?: number;
	location?: string;
}

export class PlacesQuery extends PlacesFilter {
	protected _mapSpread?: number;
	protected _limit?: number;
	protected _location?: Location;

	constructor(placesFilter: PlacesListFilterJSON) {
		super(placesFilter);
		this._limit = placesFilter.limit;
		this._mapSpread = placesFilter.mapSpread;
		this._location = placesFilter.location;
		this.validate();
	}

	public cloneSetBounds(value: Bounds | null): PlacesQuery {
		const that = Object.create(this);
		return Object.assign(that, this, {_bounds: value});
	}

	public cloneSetMapTiles(value: string[]): PlacesQuery {
		const that = Object.create(this);
		return Object.assign(that, this, {_mapTiles: value});
	}

	public cloneSetLimit(value: number): PlacesQuery {
		const that = Object.create(this);
		return Object.assign(that, this, {_limit: value});
	}

	public toQueryObject(): PlacesListFilterQuery {
		const queryObject: PlacesListFilterQuery = super.toQueryObject();
		if (this._mapSpread) {
			queryObject.map_spread = this._mapSpread;
		}
		if (this._limit) {
			queryObject.limit = this._limit;
		}
		if (this._location) {
			queryObject.location = this._location.lat + ',' + this._location.lng;
		}
		return queryObject;
	}

	get mapSpread(): number | null {
		return this._mapSpread || null;
	}

	protected validate(): void {
		super.validate();
		if (this._mapSpread) {
			if (this._limit) {
				throw new Error('Do not use limit with mapSpread.');
			}
			if (!this._bounds) {
				throw new Error('Bounds must be specified when calling with mapSpread.');
			}
			if (!this._zoom) {
				throw new Error('Zoom must be specified when calling with mapSpread.');
			}
		}
	}
}
