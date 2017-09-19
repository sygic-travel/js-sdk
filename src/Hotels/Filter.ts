import { stringify } from 'query-string';

import { Bounds, locationToMapTileKey } from '../Geo';

export interface HotelsFilterJSON {
	checkIn: string;
	checkOut: string;
	adults: number;
	children?: number[] | null;
	maxPrice?: number | null;
	minPrice?: number | null;
	minReviewScore?: number | null;
	placeIds?: string[] | null;
	bounds?: Bounds | null;
	mapTileBounds?: string[] | null;
	stars?: number[] | null;
	currency?: string | null;
	propertyTypes?: string[] | null;
	hotelFacilities?: string[] | null;
	roomFacilities?: string[] | null;
	limit?: number;
	zoom?: number;
}

export interface HotelsFilterQuery {
	check_in: string;
	check_out: string;
	adults: number;
	children?: string;
	max_price?: number;
	min_price?: number;
	min_review_score?: number;
	place_ids?: string;
	bounds?: string;
	map_tile_bounds?: string;
	stars?: string;
	currency?: string;
	property_types?: string;
	hotel_facilities?: string;
	room_facilities?: string;
	limit?: number;
	zoom?: number;
}

export class HotelsFilter {
	protected _checkIn: string;
	protected _checkOut: string;
	protected _adults: number;
	protected _children?: number[] | null;
	protected _maxPrice?: number | null;
	protected _minPrice?: number | null;
	protected _minReviewScore?: number | null;
	protected _placeIds?: string[] | null;
	protected _bounds?: Bounds | null;
	protected _mapTileBounds?: string[] | null;
	protected _stars?: number[] | null;
	protected _currency?: string | null;
	protected _propertyTypes?: string[] | null;
	protected _hotelFacilities?: string[] | null;
	protected _roomFacilities?: string[] | null;
	protected _limit?: number;
	protected _zoom?: number;

	constructor(filter: HotelsFilterJSON) {
		this._checkIn = filter.checkIn;
		this._checkOut = filter.checkOut;
		this._adults = filter.adults;
		this._children = filter.children;
		this._maxPrice = filter.maxPrice;
		this._minPrice = filter.minPrice;
		this._minReviewScore = filter.minReviewScore;
		this._bounds = filter.bounds;
		this._placeIds = filter.placeIds;
		this._mapTileBounds = filter.mapTileBounds;
		this._stars = filter.stars;
		this._currency = filter.currency;
		this._propertyTypes = filter.propertyTypes;
		this._hotelFacilities = filter.hotelFacilities;
		this._roomFacilities = filter.roomFacilities;
		this._limit = filter.limit;
		this._zoom = filter.zoom;
		this.validate();
	}

	get zoom(): number | null {
		return this._zoom ? this._zoom : null;
	}

	get bounds(): Bounds | null {
		return this._bounds ? this._bounds : null;
	}

	public toQueryObject(): HotelsFilterQuery {
		const query: HotelsFilterQuery = {
			check_in: this._checkIn,
			check_out: this._checkOut,
			adults: this._adults,
		};
		if (this._children) {
			query.children = this._children.join(',');
		}
		if (this._maxPrice) {
			query.max_price = this._maxPrice;
		}
		if (this._minPrice) {
			query.min_price = this._minPrice;
		}
		if (this._minReviewScore) {
			query.min_review_score = this._minReviewScore;
		}
		if (this._placeIds) {
			query.place_ids = this._placeIds.join('|');
		}
		if (this._bounds) {
			query.bounds = this._bounds.south + ',' + this._bounds.west + ',' + this._bounds.north + ',' + this._bounds.east;
		}
		if (this._mapTileBounds) {
			query.map_tile_bounds = this._mapTileBounds.join(',');
		}
		if (this._stars) {
			query.stars = this._stars.join('|');
		}
		if (this._currency) {
			query.currency = this._currency;
		}
		if (this._propertyTypes) {
			query.property_types = this._propertyTypes.join('|');
		}
		if (this._hotelFacilities) {
			query.hotel_facilities = this._hotelFacilities.join(',');
		}
		if (this._roomFacilities) {
			query.room_facilities = this._roomFacilities.join(',');
		}
		if (this._limit) {
			query.limit = this._limit;
		}
		return query;
	}

	public toQueryString(): string {
		return stringify(this.toQueryObject());
	}

	public switchBoundsToMapTileBounds(): HotelsFilter {
		const that = Object.create(this);
		if (!this._bounds || !this._zoom) {
			return Object.assign(that, this, {_mapTileBounds: null});
		}
		const swMapTile = locationToMapTileKey({lat: this._bounds.south, lng: this._bounds.west}, this._zoom);
		const neMapTile = locationToMapTileKey({lat: this._bounds.north, lng: this._bounds.east}, this._zoom);
		return Object.assign(that, this, {_bounds: null, _mapTileBounds: [swMapTile, neMapTile]});
	}

	private validate(): void {
		if (!this._adults) {
			throw new Error('Adults count is mandatory.');
		}
		if ([this._bounds, this._mapTileBounds, this._placeIds].filter((it) => it).length !== 1) {
			throw new Error('Bounds, mapTileBounds and places have to be used exclusively and one of them has to be present.');
		}
		const chInDate = new Date(this._checkIn);
		const chOutDate = new Date(this._checkOut);
		if (chInDate.toString() === 'Invalid Date') {
			throw new Error('Invalid checkIn date.');
		}
		if (chOutDate.toString() === 'Invalid Date') {
			throw new Error('Invalid checkOut date.');
		}
		if (chOutDate <= chInDate) {
			throw new Error('Invalid checkIn/checkOut combination.');
		}
	}
}
