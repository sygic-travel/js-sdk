import { acquire, getByLocation, getByQuery } from '../Wikimedia';

export default class WikimediaModule {
	public acquire = acquire;
	public getByLocation = getByLocation;
	public getByQuery = getByQuery;
}
