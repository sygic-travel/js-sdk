import {
	Collection,
	CollectionsFilter,
	CollectionsFilterJSON,
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
		filter: CollectionsFilterJSON,
		loadPlaces: boolean,
		photoSize: string
	): Promise<Collection[]> {
		return getCollections(new CollectionsFilter(filter), loadPlaces, photoSize);
	}
};
