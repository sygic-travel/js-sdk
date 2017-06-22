/* tslint:disable */
import { Address, AddressFields, SearchAddressResult } from '../Search/SearchAddressResult';
import { Location } from '../Geo';

export const locations = [{
	type: 'poi',
	location: {
		lat: 43.28442,
		lng: 28.04403
	} as Location,
	distance: null,
	address: {
		full: 'Bulgaria, 1000, Varna, Tourist Attractions, Important Tourist Attraction, Eiffel Tower',
		short: 'Varna 1000, Bulgaria',
		fields: {
			name: null,
			houseNumber: null,
			street: null,
			city: 'Varna',
			state: null,
			postalCode: '1000',
			country: 'Bulgaria'
		} as AddressFields
	} as Address
} as SearchAddressResult, {
	type: 'street',
	location: {
		lat: 36.29416,
		lng: -88.29645
	} as Location,
	distance: 100,
	address: {
		full: 'Tennessee, 38242, Henry - Paris, Eiffel Tower Lane',
		short: 'Eiffel Tower Lane, Henry - Paris 38242, Tennessee',
		fields: {
			name: null,
			houseNumber: null,
			street: 'Eiffel Tower Lane',
			city: 'Henry - Paris',
			state: null,
			postalCode: '38242',
			country: 'Tennessee'
		} as AddressFields
	} as Address
} as SearchAddressResult];
