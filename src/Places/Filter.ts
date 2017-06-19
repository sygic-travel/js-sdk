import * as queryString from 'querystring';
import { Bounds } from '../Geo/Bounds';

export interface PlacesFilterJSON {
	query?: string;
	mapTile?: string;
	mapSpread?: number;
	categories?: string[];
	categoriesOperator?: LogicalOperator;
	tags?: string[];
	tagsOperator?: LogicalOperator;
	parents?: string[];
	parentsOperator?: LogicalOperator;
	levels?: string[];
	limit?: number;
	bounds?: Bounds;
	zoom?: number;
}

interface PlacesFilterQuery {
	query?: string;
	map_tiles?: string;
	map_spread?: number;
	categories?: string;
	categoriesOperator?: LogicalOperator;
	tags?: string;
	tagsOperator?: LogicalOperator;
	parents?: string;
	parentsOperator?: LogicalOperator;
	levels?: string;
	limit?: number;
	bounds?: string;
}

export enum LogicalOperator {
	AND,
	OR
}

export class PlacesFilter {
	private _query?: string;
	private _mapTile?: string;
	private _mapSpread?: number;
	private _categories?: string[];
	private _categoriesOperator?: LogicalOperator;
	private _tags?: string[];
	private _tagsOperator?: LogicalOperator;
	private _parents?: string[];
	private _parentsOperator?: LogicalOperator;
	private _levels?: string[];
	private _limit?: number;
	private _bounds?: Bounds;
	private _zoom?: number;

	constructor(placesFilter: PlacesFilterJSON) {
		this._query = placesFilter.query;
		this._mapTile = placesFilter.mapTile;
		this._mapSpread = placesFilter.mapSpread;
		this._categories = placesFilter.categories;
		this._categoriesOperator = placesFilter.categoriesOperator ? placesFilter.categoriesOperator : LogicalOperator.AND;
		this._tags = placesFilter.tags;
		this._tagsOperator = placesFilter.tagsOperator ? placesFilter.tagsOperator : LogicalOperator.AND;
		this._parents = placesFilter.parents;
		this._parentsOperator = placesFilter.parentsOperator ? placesFilter.parentsOperator : LogicalOperator.AND;
		this._levels = placesFilter.levels;
		this._limit = placesFilter.limit;
		this._bounds = placesFilter.bounds;
		this._zoom = placesFilter.zoom;
		this.validate();
	}

	get mapSpread(): number | null {
		return this._mapSpread || null;
	}

	get bounds(): Bounds | null  {
		return this._bounds || null;
	}

	public cloneSetBounds(value: Bounds | null): PlacesFilter {
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

	get zoom(): number | null  {
		return this._zoom || null ;
	}

	public toQueryString(): string {
		const query: PlacesFilterQuery = {};

		if (this._query) {
			query.query = this._query;
		}

		if (this._mapTile) {
			query.map_tiles = this._mapTile;
		}

		if (this._mapSpread) {
			query.map_spread = this._mapSpread;
		}

		if (this._categories && this._categories.length > 0) {
			query.categories = this._categories.join(this._categoriesOperator === LogicalOperator.AND ? ',' : '|');
		}

		if (this._tags && this._tags.length > 0) {
			query.tags = this._tags.join(this._tagsOperator === LogicalOperator.AND ? ',' : '|');
		}

		if (this._parents && this._parents.length > 0) {
			query.parents = this._parents.join(this._parentsOperator === LogicalOperator.AND ? ',' : '|');
		}

		if (this._levels) {
			query.levels = this._levels.join('|');
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
