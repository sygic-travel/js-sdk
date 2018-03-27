import {
	getGetYourGuideTagStats,
	getToursGetYourGuide,
	getToursViator,
	Tour,
	ToursGetYourGuideQuery,
	ToursTagStats,
	ToursViatorQuery
} from '../Tours';

/**
 * @experimental
 */
export default class ToursModule {
	public getToursViator(toursQuery: ToursViatorQuery): Promise<Tour[]> {
		return getToursViator(toursQuery);
	}
	public getToursGetYourGuide(toursQuery: ToursGetYourGuideQuery): Promise<Tour[]> {
		return getToursGetYourGuide(toursQuery);
	}
	public getGetYourGuideTagStats(toursQuery: ToursGetYourGuideQuery): Promise<ToursTagStats[]> {
		return getGetYourGuideTagStats(toursQuery);
	}
}
