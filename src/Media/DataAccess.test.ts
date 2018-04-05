import * as chai from 'chai';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';
import { cloneDeep } from '../Util';

import { Medium, Type, UploadMetadata } from '.';
import { ApiResponse, StApi } from '../Api';
import * as PlacApiData from '../TestData/PlacesApiResponses';
import * as PlaceResults from '../TestData/PlacesExpectedResults';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;

describe('MediaDataAccess', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#upload', () => {
		it('should correctly call api and map result', async () => {
			const apiResponse: any = {
				medium: cloneDeep(PlacApiData.placeDetailMedia.media[0])
			};
			const apiStub = sandbox.stub(StApi, 'postMultipartJsonImage').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(apiResponse)));
			}));

			const metaData: UploadMetadata = {
				type: Type.PHOTO,
				attribution: {
					titleUrl: 'titleUrl',
					title: 'title',
					authorUrl: 'authorUrl',
					author: 'author',
					license: 'license',
					licenseUrl: 'licenseUrl',
					other: null
				},
				url: null
			};

			const callData: any = {
				place_id: 'poi:530',
				type: 'photo',
				url: null,
				attribution: {
					title_url: 'titleUrl',
					title: 'title',
					author_url: 'authorUrl',
					author: 'author',
					license: 'license',
					license_url: 'licenseUrl',
					other: null
				},
				source: {
					name: null, // Not used but required by api
					external_id: null  // Not used but required by api
				}
			};

			const result: Medium = await Dao.upload('poi:530', 'aaa', 'image/jpeg', metaData);
			chai.expect(apiStub.getCall(0).args[0])
				.to.equal('media');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal(callData);
			chai.expect(apiStub.getCall(0).args[2]).to.equal('image/jpeg');
			chai.expect(apiStub.getCall(0).args[3]).to.equal('aaa');
			chai.expect(result.id).to.deep.equal(PlaceResults.mappedMedia.square!.id);
			chai.expect(result.urlTemplate).to.deep.equal(PlaceResults.mappedMedia.square!.urlTemplate);
		});
	});
});
