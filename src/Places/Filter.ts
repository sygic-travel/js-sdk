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
		const urlComponents: string[] = [];

		if (this.query) {
			urlComponents.push('query=' + this.query);
		}

		if (this.mapTile) {
			urlComponents.push('map_tile=' + this.mapTile);
		}

		if (this.mapSpread) {
			urlComponents.push('map_spread=' + this.mapSpread);
		}

		if (this.categories && this.categories.length > 0) {
			urlComponents.push('categories=' + this.categories.join('|'));
		}

		if (this.tags && this.tags.length > 0) {
			urlComponents.push('tags=' + this.tags.join('|'));
		}

		if (this.parent) {
			urlComponents.push('parent=' + this.parent);
		}

		if (this.level) {
			urlComponents.push('level=' + this.level);
		}

		if (this.limit) {
			urlComponents.push('limit=' + this.limit);
		}

		return '?' + urlComponents.join('&');
	}
};
