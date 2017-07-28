import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';

import * as ApiResponses from '../TestData/TripApiResponses';
import * as ExpectedResults from '../TestData/TripExpectedResults';
import * as Mapper from '../Trip/Mapper';
import { UserSettings } from '../User';

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
			const trip = Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, null);
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
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, null))
				.to.deep.equal(result);
		});

		it('should correctly map api response and set home stickiness in first day', () => {
			const result = cloneDeep(ExpectedResults.tripDetailed);
			result.days.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			result.days[0].itinerary[0].isSticky = true;
			const userSettings: UserSettings = {
				homePlaceId: 'poi:1',
				workPlaceId: null
			};
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, userSettings))
				.to.deep.equal(result);
		});

		it('should correctly map api response and set work stickiness in first day', () => {
			const result = cloneDeep(ExpectedResults.tripDetailed);
			result.days.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			result.days[0].itinerary[0].isSticky = true;
			const userSettings: UserSettings = {
				homePlaceId: 'poi:10',
				workPlaceId: 'poi:1'
			};
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, userSettings))
				.to.deep.equal(result);
		});

		it('should correctly map api response and set home stickiness in last day', () => {
			const result = cloneDeep(ExpectedResults.tripDetailed);
			result.days.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			result.days[2].itinerary[1].isSticky = true;
			const userSettings: UserSettings = {
				homePlaceId: 'poi:5',
				workPlaceId: 'poi:10'
			};
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, userSettings))
				.to.deep.equal(result);
		});

		it('should correctly map api response and set work stickiness in last day', () => {
			const result = cloneDeep(ExpectedResults.tripDetailed);
			result.days.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			result.days[2].itinerary[1].isSticky = true;
			const userSettings: UserSettings = {
				homePlaceId: 'poi:10',
				workPlaceId: 'poi:5'
			};
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, userSettings))
				.to.deep.equal(result);
		});
	});
});
