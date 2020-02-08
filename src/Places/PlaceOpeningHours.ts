export interface PlaceOpeningHours {
	openingHours: {
		[dayDate: string]: DayOpeningHours[];
	} | null;
}

export interface DayOpeningHours {
	opening: string;
	closing: string;
	note: string | null;
}
