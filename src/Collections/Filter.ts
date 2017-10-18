import { stringify } from 'query-string';

export interface CollectionsFilterJSON {
	parentPlaceId?: string;
	placeIds?: string[];
	tags?: string[];
	tagsNot?: string[];
	query?: string;
	limit?: number;
	offset?: number;
	preferUnique?: number;
}

export interface CollectionsFilterQuery {
	parent_place_id?: string | null;
	place_ids?: string;
	tags?: string;
	tags_not?: string;
	query?: string | null;
	limit?: number | null;
	offset?: number | null;
	prefer_unique?: number | null;
}

export class CollectionsFilter {
	protected _parentPlaceId?: string | null;
	protected _placeIds?: string[];
	protected _tags?: string[];
	protected _tagsNot?: string[];
	protected _query?: string | null;
	protected _limit?: number | null;
	protected _offset?: number | null;
	protected _preferUnique?: number | null;

	constructor(filter: CollectionsFilterJSON) {
		this._parentPlaceId = filter.parentPlaceId;
		this._placeIds = filter.placeIds;
		this._tags = filter.tags;
		this._tagsNot = filter.tagsNot;
		this._query = filter.query;
		this._limit = filter.limit;
		this._offset = filter.offset;
		this._preferUnique = filter.preferUnique;
	}

	public toQueryObject(): CollectionsFilterQuery {
		const query: CollectionsFilterQuery = {};
		if (this._parentPlaceId) {
			query.parent_place_id = this._parentPlaceId;
		}
		if (this._placeIds) {
			query.place_ids = this._placeIds.join(',');
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
		if (this._preferUnique) {
			query.prefer_unique = this._preferUnique;
		}
		return query;
	}

	public toQueryString(): string {
		return stringify(this.toQueryObject());
	}
}
