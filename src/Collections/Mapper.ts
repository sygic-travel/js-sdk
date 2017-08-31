import { Tag } from '../Places';
import { Collection } from './Collection';

export const mapCollectionApiResponseToCollection = (collection: any): Collection => {
	return mapCollection(collection);
};

export const mapCollectionsApiResponseToCollections = (collections: any): Collection[] => {
	return collections.map((collection): Collection => {
		return mapCollection(collection);
	});
};

const mapCollection = (collection) => {
	const tags: Tag[] = collection.tags.map((tag) => (tag as Tag));
	return {
		id: collection.id,
		nameLong: collection.name_long,
		nameShort: collection.name_short,
		description: collection.description,
		tags,
		placeIds: collection.place_ids,
		places: [],
	} as Collection;
};
