import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import * as ApiResponses from '../TestData/TripApiResponses';
import * as ExpectedResults from '../TestData/TripExpectedResults';
import * as Mapper from '../Trip/Mapper';

chai.use(chaiAsPromised);

describe('TripMapper', () => {
	describe('#mapTripListApiResponseToTripsList', () => {
		it('should correctly map api response to array of Trips', () => {
			return chai.expect(Mapper.mapTripListApiResponseToTripsList(ApiResponses.tripsList.trips))
				.to.deep.equal(ExpectedResults.tripList);
		});
	});
});
