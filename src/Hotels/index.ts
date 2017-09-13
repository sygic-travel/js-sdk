import * as Dao from './DataAccess';
import { HotelsFilter, HotelsFilterJSON } from './Filter';
import { AvailableHotels, Hotel } from './Hotel';

export {
	AvailableHotels,
	Hotel,
	HotelsFilter,
	HotelsFilterJSON
}

export async function getHotels(filter: HotelsFilter): Promise<AvailableHotels> {
	return await Dao.getHotels(filter);
}
