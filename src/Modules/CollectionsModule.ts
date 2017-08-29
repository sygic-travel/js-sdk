import {
	Collection,
	getCollection
} from '../Collections';

/**
 * @experimental
 */
export default class CollectionsModule {
	public getCollection(collectionId: number, photoSize: string): Promise<Collection> {
		return getCollection(collectionId, photoSize);
	}
}
