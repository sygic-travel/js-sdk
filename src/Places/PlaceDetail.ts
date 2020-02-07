import { Bounds } from '../Geo';
import { MainMedia } from '../Media/Media';

export interface Detail {
	tags: Tag[];
	address: string | null;
	admission: string | null;
	area: number | null;
	duration: number | null;
	description: Description | null;
	email: string | null;
	openingHoursNote: string | null;
	openingHoursRaw: string | null;
	phone: string | null;
	mainMedia: MainMedia;
	references: Reference[];
	/**
	 * @experimental
	 */
	ownerId?: string;
	mediaCount: number;
	satellite: SatelliteImage | null;
}

export interface Reference {
	id: number;
	title: string;
	type: string;
	languageId: string | null;
	url: string;
	supplier: string | null;
	priority: number;
	currency: string | null;
	price: number | null;
	flags: string[];
}

export interface Tag {
	key: string;
	name: string;
}

export interface Description {
	text: string;
	provider: DescriptionProvider | null;
	translationProvider: TranslationProvider | null;
	url: string | null;
	isTranslated: boolean;
}

export enum DescriptionProvider {
	WIKIPEDIA = 'wikipedia',
	WIKIVOYAGE = 'wikivoyage',
}

export enum TranslationProvider {
	GOOGLE,
}

export interface SatelliteImage {
	imageUrl: string;
	boundingBox: Bounds;
}

