import { Collection } from './Collection';
import * as Dao from './DataAccess';

export { Collection };

export async function getCollection(collectionId: number, photoSize: string): Promise<Collection> {
	return Dao.getCollection(collectionId, photoSize);
}

export async function getCollections(
	placeId: string,
	limit: number,
	offset: number,
	loadPlaces: boolean,
	photoSize: string
): Promise<Collection[]> {
	return Dao.getCollections(placeId, limit, offset, loadPlaces, photoSize);
}
