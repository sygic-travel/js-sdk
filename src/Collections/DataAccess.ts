import { stringify } from 'query-string';

import { getPlacesDetailed } from '../Places';
import { get } from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import { Collection } from './Collection';
import { mapCollectionApiResponseToCollection, mapCollectionsApiResponseToCollections } from './Mapper';

export async function getCollection(collectionId: number, photoSize: string): Promise<Collection> {
	const apiResponse: ApiResponse = await get(`collections/${collectionId}`);
	if (!apiResponse.data.hasOwnProperty('collection')) {
		throw new Error('Wrong API response');
	}

	const collection = mapCollectionApiResponseToCollection(apiResponse.data.collection);
	collection.places = await getPlacesDetailed(collection.placeIds, photoSize);
	return collection;
}

export async function getCollections(
	placeId: string,
	limit: number,
	offset: number,
	loadPlaces: boolean,
	photoSize: string
): Promise<Collection[]> {
	const apiResponse: ApiResponse = await get('collections?' + stringify({
		placeId,
		limit,
		offset
	}));
	if (!apiResponse.data.hasOwnProperty('collections')) {
		throw new Error('Wrong API response');
	}

	const collections = await mapCollectionsApiResponseToCollections(apiResponse.data.collections);
	if (loadPlaces === true) {
		await Promise.all(collections.map(async (collection: Collection) => {
			collection.places = await getPlacesDetailed(collection.placeIds, photoSize);
		}));
	}
	return collections;
}
