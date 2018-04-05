import { camelizeKeys, decamelizeKeys } from 'humps';
import { ApiResponse, StApi } from '../Api';
import { Medium, UploadMetadata } from './Media';

export async function upload(
	placeId: string,
	imageData: string,
	mimeType: string,
	metadata: UploadMetadata
): Promise<Medium> {
	const apiData: any = {
		place_id: placeId,
		type: metadata.type,
		url: metadata.url,
		attribution: decamelizeKeys(metadata.attribution),
		source: {
			name: null, // Not used but required by api
			external_id: null  // Not used but required by api
		}
	};
	const response: ApiResponse = await StApi.postMultipartJsonImage('media', apiData, mimeType, imageData);
	if (!response.data.hasOwnProperty('medium')) {
		throw new Error('Wrong API response');
	}
	return camelizeKeys(response.data.medium) as Medium;
}
