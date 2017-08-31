import {
	Collection,
	getCollection,
	getCollections
} from '../Collections';

/**
 * @experimental
 */
export default class CollectionsModule {
	public getCollection(collectionId: number, photoSize: string): Promise<Collection> {
		return getCollection(collectionId, photoSize);
	}

	public getCollections(
		placeId: string,
		limit: number,
		offset: number,
		loadPlaces: boolean,
		photoSize: string
	): Promise<Collection[]> {
		return getCollections(placeId, limit, offset, loadPlaces, photoSize);
	}
};
