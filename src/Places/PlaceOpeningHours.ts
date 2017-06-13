export interface PlaceOpeningHours {
	[dayDate: string]: DayOpeningHours[];
}

export interface DayOpeningHours {
	opening: string;
	closing: string;
	note: string | null;
}
