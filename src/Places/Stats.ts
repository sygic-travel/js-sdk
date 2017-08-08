export interface SumStatistic {
	name: string;
	key: string;
	count: number;
}

export interface PlacesStats {
	categories: SumStatistic[];
	tags: SumStatistic[];
}
