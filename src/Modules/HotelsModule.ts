import { AvailableHotels, getHotels, HotelsFilter, HotelsFilterJSON} from '../Hotels';

export default class HotelsModule {
	public getHotels(filter: HotelsFilterJSON): Promise<AvailableHotels> {
		return getHotels(new HotelsFilter(filter));
	}
}
