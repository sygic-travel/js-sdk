import { getTours, Tour, ToursQuery } from '../Tours';

/**
 * @experimental
 */
export default class ToursModule {
	public getTours(toursQuery: ToursQuery): Promise<Tour[]> {
		return getTours(toursQuery);
	}
}
