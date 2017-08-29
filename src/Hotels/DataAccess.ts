import { camelizeKeys } from 'humps';

import { Hotel, HotelsFilter } from '.';
import { mapPlace } from '../Places/Mapper';
import { ApiResponse, get } from '../Xhr';

export async function getHotels(filter: HotelsFilter): Promise<Hotel[]> {
	if (filter.bounds && filter.zoom) {
		filter = filter.switchBoundsToMapTileBounds();
	}
	const apiResponse: ApiResponse = await get('hotels/list/?' + filter.toQueryString());
	if (!apiResponse.data.hasOwnProperty('hotels')) {
		throw new Error('Wrong API response');
	}
	return apiResponse.data.hotels.map( (hotelData: any) => {
		return {
			place: mapPlace(hotelData.place, null),
			bookingCom: camelizeKeys(hotelData.booking_com)
		} as Hotel;
	});
}
