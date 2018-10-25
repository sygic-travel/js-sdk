export interface PlaceOpeningHours {
	openingHours: {
		[dayDate: string]: DayOpeningHours[];
	};
	isValid: boolean;
}

export interface DayOpeningHours {
	opening: string;
	closing: string;
	note: string | null;
}
