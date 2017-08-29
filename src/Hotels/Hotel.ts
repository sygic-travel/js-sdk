import { Place } from '../Places';

export interface Hotel {
	place: Place;
	bookingCom: {
		price: number;
		hotelId: string;
	};
}
