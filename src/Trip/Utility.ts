import { Day } from '.';
import { addDaysToDate } from '../Util';

export function decorateDaysWithDate(tripStartDate: string | null, days: Day[] | null): Day[] | null {
	if (!days) {
		return null;
	}

	return days.map((day: Day, i: number) => {
		day.date = tripStartDate ? addDaysToDate(tripStartDate, i) : null;
		return day;
	});
}
