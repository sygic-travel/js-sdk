import { Location } from '../Geo';
import * as Dao from './DataAccess';
import { WikimediaPhoto, WikimediaResult } from './Wikimedia';

export {  WikimediaPhoto, WikimediaResult };

export async function getByQuery(query: string): Promise<WikimediaResult[]> {
	return Dao.getByQuery(query);
}

export async function getByLocation(location: Location): Promise<WikimediaResult[]> {
	return Dao.getByLocation(location);
}
