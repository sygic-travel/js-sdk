import * as queryString from 'querystring';
import { Bounds } from '../Geo/Bounds';

export interface PlacesFilterJSON {
	query?: string;
	mapTile?: string;
	mapSpread?: number;
	categories?: string[];
	tags?: string[];
	parent?: string;
	level?: string;
	limit?: number;
	bounds?: Bounds;
	zoom?: number;
}

interface PlacesFilterQuery {
	query?: string;
	map_tile?: string;
	map_spread?: number;
	categories?: string;
	tags?: string;
	parent?: string;
	level?: string;
	limit?: number;
	bounds?: string;
}

export class PlacesFilter {
	private _query?: string;
	private _mapTile?: string;
	private _mapSpread?: number;
	private _categories?: string[];
	private _tags?: string[];
	private _parent?: string;
	private _level?: string;
	private _limit?: number;
	private _bounds?: Bounds;
	private _zoom?: number;

	constructor(placesFilter: PlacesFilterJSON) {
		this._query = placesFilter.query;
		this._mapTile = placesFilter.mapTile;
		this._mapSpread = placesFilter.mapSpread;
		this._categories = placesFilter.categories;
		this._tags = placesFilter.tags;
		this._parent = placesFilter.parent;
		this._level = placesFilter.level;
		this._limit = placesFilter.limit;
		this._bounds = placesFilter.bounds;
		this._zoom = placesFilter.zoom;
		this.validate();
	}

	get mapSpread(): number {
		return this._mapSpread;
	}

	get bounds(): Bounds {
		return this._bounds;
	}

	public cloneSetBounds(value: Bounds): PlacesFilter {
		const that = Object.create(this);
		return Object.assign(that, this, {_bounds: value});
	}

	public cloneSetLimit(value: number): PlacesFilter {
		const that = Object.create(this);
		return Object.assign(that, this, {_limit: value});
	}

	public cloneSetMapTile(value: string): PlacesFilter {
		const that = Object.create(this);
		return Object.assign(that, this, {_mapTile: value});
	}

	get zoom(): number {
		return this._zoom;
	}

	public toQueryString(): string {
		const query: PlacesFilterQuery = {};

		if (this._query) {
			query.query = this._query;
		}

		if (this._mapTile) {
			query.map_tile = this._mapTile;
		}

		if (this._mapSpread) {
			query.map_spread = this._mapSpread;
		}

		if (this._categories && this._categories.length > 0) {
			query.categories = this._categories.join('|');
		}

		if (this._tags && this._tags.length > 0) {
			query.tags = this._tags.join('|');
		}

		if (this._parent) {
			query.parent = this._parent;
		}

		if (this._level) {
			query.level = this._level;
		}

		if (this._limit) {
			query.limit = this._limit;
		}

		if (this._bounds) {
			query.bounds = this._bounds.south + ',' + this._bounds.west + ',' + this._bounds.north + ',' + this._bounds.east;
		}

		return queryString.stringify(query);
	}

	private validate(): void {
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
