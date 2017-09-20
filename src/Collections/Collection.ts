import { Place, Tag } from '../Places';

export interface Collection {
	id: number;
	parentPlaceId: string,
	nameLong: string;
	nameShort: string | null;
	description: string | null;
	tags: Tag[];
	placeIds: string[];
	places: Place[];
}
