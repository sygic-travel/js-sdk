import { Location } from '../Geo';

export interface SearchAddressResult {
	location: Location;
	type: string;
	address: Address | null;
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
