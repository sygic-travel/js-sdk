import { Collection } from './Collection';
import * as Dao from './DataAccess';
import { CollectionsFilter, CollectionsFilterJSON } from './Filter';

export { Collection, CollectionsFilter, CollectionsFilterJSON };

export async function getCollection(collectionId: number, photoSize: string): Promise<Collection> {
	return Dao.getCollection(collectionId, photoSize);
}

export async function getCollections(
	filter: CollectionsFilter,
	loadPlaces: boolean,
	photoSize: string
): Promise<Collection[]> {
	return Dao.getCollections(filter, loadPlaces, photoSize);
}
