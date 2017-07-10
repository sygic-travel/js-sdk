import * as Dao from './DataAccess';
import { Tour } from './Tour';
import { ToursQuery, ToursQueryDirection, ToursQuerySortBy } from './ToursQuery';

export { Tour, ToursQuery, ToursQueryDirection, ToursQuerySortBy };

export async function getTours(toursQuery: ToursQuery): Promise<Tour[]> {
	return Dao.getTours(toursQuery);
}
