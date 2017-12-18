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

export async function getCollectionsForDestinationId(destinationId: string, imageSize: string): Promise<Collection[]> {
	const collectionsFilter: CollectionsFilter = new CollectionsFilter({
		parentPlaceId: destinationId
	});
	return getCollections(collectionsFilter, true, imageSize);
}
