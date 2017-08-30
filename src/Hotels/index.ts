import * as Dao from './DataAccess';
import { HotelsFilter, HotelsFilterJSON } from './Filter';
import { Hotel } from './Hotel';

export {
	Hotel,
	HotelsFilter,
	HotelsFilterJSON
}

export async function getHotels(filter: HotelsFilter): Promise<Hotel[]> {
	return await Dao.getHotels(filter);
}
