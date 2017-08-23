import { MainMedia } from '../Media/Media';

export interface PlaceDetail {
	tags: Tag[];
	address: string | null;
	admission: string | null;
	duration: number | null;
	description: Description | null;
	email: string | null;
	openingHours: string | null;
	phone: string | null;
	media: MainMedia;
	references: Reference[];
	/**
	 * @experimental
	 */
	ownerId?: string;
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
	provider: string | null;
	translationProvider: string | null;
	link: string | null;
	isTranslated: boolean;
}
