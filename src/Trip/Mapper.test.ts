import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { cloneDeep } from '../Util';

import * as ApiResponses from '../TestData/TripApiResponses';
import * as ExpectedResults from '../TestData/TripExpectedResults';
import * as Mapper from '../Trip/Mapper';
import { UserSettings } from '../Session';
import { Trip, TripCreateRequest } from './Trip';

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

	describe('#mapTripCreateRequest', () => {
		it('should throw an error when low daysCount is passed', () => {
			return chai.expect(() => Mapper.mapTripCreateRequest('2017-12-13', 'Awesome', 0))
				.to.throw(Error, 'Invalid trip days count. Value between 1 and 81 expected.');
		});
		it('should throw an error when too high daysCount is passed', () => {
			return chai.expect(() => Mapper.mapTripCreateRequest('2017-12-13', 'Awesome', 82))
				.to.throw(Error, 'Invalid trip days count. Value between 1 and 81 expected.');
		});
		it('should create correct request for days', () => {
			const tripRequest: TripCreateRequest = Mapper.mapTripCreateRequest('2017-12-13', 'Awesome', 2);
			chai.expect(tripRequest.days).to.have.lengthOf(2);
			chai.expect(tripRequest.startsOn).to.be.equal('2017-12-13');
			chai.expect(tripRequest.name).to.be.equal('Awesome');
			chai.expect(tripRequest.days[0].itinerary).to.have.length(0);
			chai.expect(tripRequest.days[1].itinerary).to.have.length(0);
		});
		it('should create correct request for days and place', () => {
			const tripRequest: TripCreateRequest = Mapper.mapTripCreateRequest('2017-12-13', 'Awesome', 2, 'poi:530');
			chai.expect(tripRequest.days).to.have.lengthOf(2);
			chai.expect(tripRequest.startsOn).to.be.equal('2017-12-13');
			chai.expect(tripRequest.name).to.be.equal('Awesome');
			chai.expect(tripRequest.days[0].itinerary).to.have.length(1);
			chai.expect(tripRequest.days[1].itinerary).to.have.length(0);
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
			const result: Trip = cloneDeep(ExpectedResults.tripDetailed);
			result.days!.forEach((day) => {
				day.itinerary.forEach((item) => {
					delete item.place;
				});
			});
			result.days![0].itinerary[0].isSticky = true;
			result.days![0].itinerary[0].isStickyFirstInDay = true;
			result.days![0].itinerary[0].isStickyLastInDay = false;
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
			result.days![0].itinerary[0].isStickyFirstInDay = true;
			result.days![0].itinerary[0].isStickyLastInDay = false;
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
			result.days![2].itinerary[1].isStickyFirstInDay = false;
			result.days![2].itinerary[1].isStickyLastInDay = true;
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
			result.days![2].itinerary[1].isStickyFirstInDay = false;
			result.days![2].itinerary[1].isStickyLastInDay = true;
			const userSettings: UserSettings = {
				homePlaceId: 'poi:10',
				workPlaceId: 'poi:5'
			};
			chai.expect(Mapper.mapTripDetailedApiResponseToTrip(ApiResponses.tripDetail.trip, userSettings))
				.to.deep.equal(result);
		});
	});
});
