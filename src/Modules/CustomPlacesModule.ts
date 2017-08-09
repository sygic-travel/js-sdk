import {
	createCustomPlace,
	CustomPlaceFormData,
	deleteCustomPlace,
	Place,
	updateCustomPlace
} from '../Places';

/**
 * @experimental
 */
export default class CustomPlacesModule {
	public createCustomPlace(data: CustomPlaceFormData): Promise<Place> {
		return createCustomPlace(data);
	}

	public updateCustomPlace(id: string, data: CustomPlaceFormData): Promise<Place> {
		return updateCustomPlace(id, data);
	}

	public deleteCustomPlace(id: string): Promise<void> {
		return deleteCustomPlace(id);
	}
}
