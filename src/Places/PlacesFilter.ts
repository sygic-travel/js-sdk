interface PlacesFilter {
	query?: string;
	mapTile?: string;
	mapSpread?: number;
	categories?: Array<string>;
	tags?: Array<string>;
	parent?: string;
	level?: string;
	limit?: number;
}

export default PlacesFilter;
