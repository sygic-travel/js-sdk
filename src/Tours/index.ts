import * as Dao from './DataAccess';
import {
	Tour, ToursGetYourGuideQuery, ToursGetYourGuideQuerySortBy,
	ToursQueryDirection, ToursViatorQuery, ToursViatorQuerySortBy
} from './Tour';

export { Tour, ToursGetYourGuideQuery, ToursGetYourGuideQuerySortBy,
	ToursViatorQuery, ToursQueryDirection, ToursViatorQuerySortBy
};

export async function getToursViator(toursQuery: ToursViatorQuery): Promise<Tour[]> {
	return Dao.getToursViator(toursQuery);
}

export async function getToursGetYourGuide(toursQuery: ToursGetYourGuideQuery): Promise<Tour[]> {
	return Dao.getToursGetYourGuide(toursQuery);
}
