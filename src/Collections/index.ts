import { Collection } from './Collection';
import * as Dao from './DataAccess';

export { Collection };

export async function getCollection(collectionId: number, photoSize: string): Promise<Collection> {
	return Dao.getCollection(collectionId, photoSize);
}
