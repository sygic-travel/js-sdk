import { Place, Tag } from '../Places';

export interface Hotel {
	place: Place;
	bookingCom: {
		price: number;
		hotelId: string;
		availableRoomsCount: number;
	};
}

export interface AvailableHotels {
	hotels: Hotel[];
	hotelFacilities: Tag[];
	roomFacilities: Tag[];
}
