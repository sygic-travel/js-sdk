import * as queryString from 'querystring';

export interface PlacesFilterJSON {
	query?: string;
	mapTile?: string;
	mapSpread?: number;
	categories?: string[];
	tags?: string[];
	parent?: string;
	level?: string;
	limit?: number;
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
}

export class PlacesFilter {
	private query?: string;
	private mapTile?: string;
	private mapSpread?: number;
	private categories?: string[];
	private tags?: string[];
	private parent?: string;
	private level?: string;
	private limit?: number;

	constructor(placesFilter: PlacesFilterJSON) {
		this.query = placesFilter.query;
		this.mapTile = placesFilter.mapTile;
		this.mapSpread = placesFilter.mapSpread;
		this.categories = placesFilter.categories;
		this.tags = placesFilter.tags;
		this.parent = placesFilter.parent;
		this.level = placesFilter.level;
		this.limit = placesFilter.limit;
	}

	public toQueryString(): string {
		const query: PlacesFilterQuery = {};

		if (this.query) {
			query.query = this.query;
		}

		if (this.mapTile) {
			query.map_tile = this.mapTile;
		}

		if (this.mapSpread) {
			query.map_spread = this.mapSpread;
		}

		if (this.categories && this.categories.length > 0) {
			query.categories = this.categories.join('|');
		}

		if (this.tags && this.tags.length > 0) {
			query.tags = this.tags.join('|');
		}

		if (this.parent) {
			query.parent = this.parent;
		}

		if (this.level) {
			query.level = this.level;
		}

		if (this.limit) {
			query.limit = this.limit;
		}

		return queryString.stringify(query);
	}
}
