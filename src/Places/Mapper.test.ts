import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { camelizeKeys } from 'humps';
import * as sinon from 'sinon';

import * as Media from '../Media/Media';
import * as ApiResponses from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Mapper from './Mapper';

chai.use(chaiAsPromised);

let sandbox;

describe('PlacesMapper', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#mapPlaceApiResponseToPlaces', () => {

		it('should correctly map api response to array of Places', () => {
			const apiResponse: ApiResponse = new ApiResponse('200', 200, '', ApiResponses.places);

			return chai.expect(Mapper.mapPlaceApiResponseToPlaces(apiResponse)).to.deep.equal(ExpectedResults.places);
		});
	});

	describe('#mapPlaceDetailedApiResponseToPlace', () => {
		it('should correctly map api response to single Place with PlaceDetail', () => {
			const apiResponse: ApiResponse = new ApiResponse('200', 200, '', ApiResponses.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(Mapper.mapPlaceDetailedApiResponseToPlace(apiResponse, '400x400'))
				.to.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#mapMainMediaToMedia', () => {
		it('should correctly map media from place detailed api response', () => {
			const mainMedia: Media.MainMedia = camelizeKeys(ApiResponses.placeDetailMedia) as Media.MainMedia;

			return chai.expect(Mapper.mapMainMediaToMedia(mainMedia, '400x400'))
				.to.deep.equal(ExpectedResults.mappedMedia);
		});
	});
});
