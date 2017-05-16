import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as ApiResponses from '../TestData/TripApiResponses';
import * as ExpectedResults from '../TestData/TripExpectedResults';
import * as Mapper from '../Trip/Mapper';
import { ApiResponse } from '../Xhr/ApiResponse';

chai.use(chaiAsPromised);

describe('TripMapper', () => {
	describe('#mapTripListApiResponseToTripsList', () => {
		it('should correctly map api response to array of Trips', () => {
			const apiResponse: ApiResponse = new ApiResponse(200, ApiResponses.tripsList);
			return chai.expect(Mapper.mapTripListApiResponseToTripsList(apiResponse)).to.deep.equal(ExpectedResults.tripList);
		});
	});
});
