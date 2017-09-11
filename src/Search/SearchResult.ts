import { Location } from '../Geo';
import { Place, Tag } from '../Places';

export interface SearchResult {
	location: Location;
	type: string | null;
	address: Address | null;
	distance: number | null;
	place: Place | null;
}

export interface Address {
	full: string;
	short: string;
	fields: AddressFields;
}

export interface AddressFields {
	name: string | null;
	houseNumber: string | null;
	street: string | null;
	city: string | null;
	state: string | null;
	postalCode: string | null;
	country: string | null;
}

export interface SearchTagsResult extends Tag {
	priority: number;
	isVisible: boolean;
}
