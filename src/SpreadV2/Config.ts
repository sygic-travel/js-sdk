import { camelize } from 'humps';

export interface CategoriesCoefficients {
	noCategory: number;
	discovering: number;
	eating: number;
	goingOut: number;
	hiking: number;
	playing: number;
	relaxing: number;
	shopping: number;
	sightseeing: number;
	sleeping: number;
	doingSports: number;
	traveling: number;
}

export interface SpreadSizeConfig {
	radius: number;
	margin: number;
	name: string;
	photoRequired: boolean;
	zoomLevelLimits: number[];
	disabledCategories: string[];
}

/**
 * https://confluence.sygic.com/display/STV/Map+Markers+2
 */
export function getSizesConfig(): SpreadSizeConfig[] {
	return [
		{
			radius: 29,
			margin: 0,
			name: 'popular',
			photoRequired: true,
			zoomLevelLimits: [1, 1, 1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
			disabledCategories: [
				'no_category', 'eating', 'going_out', 'playing', 'shopping', 'sleeping', 'doing_sports', 'traveling'
			]
		},
		{
			radius: 22,
			margin: 0,
			name: 'big',
			photoRequired: true,
			zoomLevelLimits: [
				0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.04, 0.03, 0.02, 0.015, 0.010, 0.008, 0.007, 0.006, 0.005, 0.004, 0.003
			],
			disabledCategories: [
				'no_category', 'eating', 'going_out', 'playing', 'shopping', 'sleeping', 'doing_sports', 'traveling'
			]
		},
		{
			radius: 10,
			margin: 0,
			name: 'medium',
			photoRequired: false,
			zoomLevelLimits: [
				0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.007, 0.006, 0.005, 0.004, 0.003, 0.002, 0.0015, 0.001, 0.001, 0
			],
			disabledCategories: []
		},
		{
			radius: 4,
			margin: 5,
			name: 'small',
			photoRequired: false,
			zoomLevelLimits: [
				0.01, 0.01, 0.01, 0.01, 0.01, 0.008, 0.006, 0.004, 0.003, 0.0025, 0.0020, 0.0015, 0.0010, 0.0005, 0
			],
			disabledCategories: []
		},
	];
}

export function getCategoriesConfig(): CategoriesCoefficients {
	return {
		noCategory: 0.3,
		discovering: 0.8,
		eating: 0.6,
		goingOut: 0.6,
		hiking: 0.5,
		playing: 0.5,
		relaxing: 0.6,
		shopping: 0.5,
		sightseeing: 1,
		sleeping: 0.2,
		doingSports: 0.4,
		traveling: 0.1,
	} as CategoriesCoefficients;
}

export function getRatingCoeficientFromCategories(
	categoriesCoefficients: CategoriesCoefficients,
	categories: string[]
): number {
	if (categories.length === 0) {
		categories = ['no_category'];
	}
	return categories.reduce( (maxCoef, category) => {
		if (categoriesCoefficients[camelize(category)] && categoriesCoefficients[camelize(category)] > maxCoef) {
			return categoriesCoefficients[camelize(category)];
		}
		return maxCoef;
	}, 0);
}

export function isDisabledByCategory(
	disabledCategories: string[],
	placeCategories: string[]
): boolean {
	if (placeCategories.length === 0) {
		placeCategories = ['no_category'];
	}
	if (placeCategories.length > disabledCategories.length) {
		return false;
	}

	for (const category of placeCategories) {
		if (disabledCategories.indexOf(category) === -1) {
			return false;
		}
	}

	return true;
}
