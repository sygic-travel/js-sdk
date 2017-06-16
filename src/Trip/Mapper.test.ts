import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';

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

	describe('#mapTripToApiFormat', () => {
		it('should correctly map trip to api response', () => {
			const expectedResponse = ApiResponses.tripDetail.trip;
			const trip = Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip);
			const mappedResponse = Mapper.mapTripToApiFormat(trip);
			return chai.expect(mappedResponse).to.deep.equal(expectedResponse);
		});
	});

	describe('#mapTripDetailedApiResponseToTrip', () => {
		it('should correctly map api response without detail places to trip', () => {
			const result = cloneDeep(ExpectedResults.tripDetailed);
			result.days.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip))
				.to.deep.equal(result);
		});
	});
});
