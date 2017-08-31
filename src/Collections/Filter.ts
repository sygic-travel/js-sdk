import { stringify } from 'query-string';

export interface CollectionsFilterJSON {
	placeId?: string;
	containedPlaceIds?: string[];
	tags?: string[];
	tagsNot?: string[];
	query?: string;
	limit?: number;
	offset?: number;
}

export interface CollectionsFilterQuery {
	place_id?: string | null;
	contained_place_ids?: string;
	tags?: string;
	tags_not?: string;
	query?: string | null;
	limit?: number | null;
	offset?: number | null;
}

export class CollectionsFilter {
	protected _placeId?: string | null;
	protected _containedPlaceIds?: string[];
	protected _tags?: string[];
	protected _tagsNot?: string[];
	protected _query?: string | null;
	protected _limit?: number | null;
	protected _offset?: number | null;

	constructor(filter: CollectionsFilterJSON) {
		this._placeId = filter.placeId;
		this._containedPlaceIds = filter.containedPlaceIds;
		this._tags = filter.tags;
		this._tagsNot = filter.tagsNot;
		this._query = filter.query;
		this._limit = filter.limit;
		this._offset = filter.offset;
	}

	public toQueryObject(): CollectionsFilterQuery {
		const query: CollectionsFilterQuery = {};
		if (this._placeId) {
			query.place_id = this._placeId;
		}
		if (this._containedPlaceIds) {
			query.contained_place_ids = this._containedPlaceIds.join(',');
		}
		if (this._tags) {
			query.tags = this._tags.join(',');
		}
		if (this._tagsNot) {
			query.tags_not = this._tagsNot.join(',');
		}
		if (this._query) {
			query.query = this._query;
		}
		if (this._limit) {
			query.limit = this._limit;
		}
		if (this._offset) {
			query.offset = this._offset;
		}
		return query;
	}

	public toQueryString(): string {
		return stringify(this.toQueryObject());
	}
}
