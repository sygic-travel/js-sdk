import { getPlacesDetailed } from '../Places';
import { get } from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import { Collection } from './Collection';
import { mapCollectionApiResponseToCollection } from './Mapper';

export async function getCollection(collectionId: number, photoSize: string): Promise<Collection> {
	const apiResponse: ApiResponse = await get(`collections/${collectionId}`);
	if (!apiResponse.data.hasOwnProperty('collection')) {
		throw new Error('Wrong API response');
	}

	const collection = mapCollectionApiResponseToCollection(apiResponse.data.collection);
	collection.places = await getPlacesDetailed(collection.placeIds, photoSize);
	return collection;
}
