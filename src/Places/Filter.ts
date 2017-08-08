import * as queryString from 'querystring';
import { Bounds } from '../Geo/Bounds';

export interface PlacesFilterJSON {
	query?: string;
	mapTiles?: string[];
	categories?: string[];
	categoriesOperator?: LogicalOperator;
	tags?: string[];
	tagsOperator?: LogicalOperator;
	parents?: string[];
	parentsOperator?: LogicalOperator;
	levels?: string[];
	bounds?: Bounds;
	zoom?: number;
}

export interface PlacesFilterQuery {
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

export abstract class PlacesFilter {
	protected _query?: string;
	protected _mapTiles?: string[];
	protected _categories?: string[];
	protected _categoriesOperator?: LogicalOperator;
	protected _tags?: string[];
	protected _tagsOperator?: LogicalOperator;
	protected _parents?: string[];
	protected _parentsOperator?: LogicalOperator;
	protected _levels?: string[];
	protected _bounds?: Bounds;
	protected _zoom?: number;

	constructor(placesFilter: PlacesFilterJSON) {
		this._query = placesFilter.query;
		this._mapTiles = placesFilter.mapTiles;
		this._categories = placesFilter.categories;
		this._categoriesOperator = placesFilter.categoriesOperator ? placesFilter.categoriesOperator : LogicalOperator.AND;
		this._tags = placesFilter.tags;
		this._tagsOperator = placesFilter.tagsOperator ? placesFilter.tagsOperator : LogicalOperator.AND;
		this._parents = placesFilter.parents;
		this._parentsOperator = placesFilter.parentsOperator ? placesFilter.parentsOperator : LogicalOperator.AND;
		this._levels = placesFilter.levels;
		this._bounds = placesFilter.bounds;
		this._zoom = placesFilter.zoom;
		this.validate();
	}

	get bounds(): Bounds | null  {
		return this._bounds || null;
	}

	get zoom(): number | null  {
		return this._zoom || null ;
	}

	public toQueryObject(): PlacesFilterQuery {
		const query: PlacesFilterQuery = {};

		if (this._query) {
			query.query = this._query;
		}

		if (this._mapTiles) {
			query.map_tiles = this._mapTiles.join('|');
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

		if (this._bounds) {
			query.bounds = this._bounds.south + ',' + this._bounds.west + ',' + this._bounds.north + ',' + this._bounds.east;
		}
		return query;
	}

	public toQueryString(): string {
		return queryString.stringify(this.toQueryObject());
	}

	protected validate(): void {
		return;
	}
}
