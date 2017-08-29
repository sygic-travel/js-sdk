import { getHotels, Hotel, HotelsFilter, HotelsFilterJSON} from '../Hotels';

export default class HotelsModule {
	public getHotels(filter: HotelsFilterJSON): Promise<Hotel[]> {
		return getHotels(new HotelsFilter(filter));
	}
}
