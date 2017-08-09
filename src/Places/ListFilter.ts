import { Bounds } from '../Geo';
import { PlacesFilter, PlacesFilterJSON, PlacesFilterQuery } from './Filter';

export interface PlacesListFilterJSON extends PlacesFilterJSON {
	mapSpread?: number;
	limit?: number;
}

export interface PlacesListFilterQuery extends PlacesFilterQuery {
	map_spread?: number;
	limit?: number;
}

export class PlacesListFilter extends PlacesFilter {
	protected _mapSpread?: number;
	protected _limit?: number;

	constructor(placesFilter: PlacesListFilterJSON) {
		super(placesFilter);
		this._limit = placesFilter.limit;
		this._mapSpread = placesFilter.mapSpread;
		this.validate();
	}

	public cloneSetBounds(value: Bounds | null): PlacesListFilter {
		const that = Object.create(this);
		return Object.assign(that, this, {_bounds: value});
	}

	public cloneSetMapTiles(value: string[]): PlacesListFilter {
		const that = Object.create(this);
		return Object.assign(that, this, {_mapTiles: value});
	}

	public cloneSetLimit(value: number): PlacesListFilter {
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
