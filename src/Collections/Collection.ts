import { Place, Tag } from '../Places';

export interface Collection {
	id: number;
	nameLong: string;
	nameShort: string | null;
	description: string | null;
	tags: Tag[];
	placeIds: string[];
	places: Place[];
}
