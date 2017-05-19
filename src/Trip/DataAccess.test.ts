import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache, tripsDetailedCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as TripTestData from '../TestData/TripApiResponses';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { Day, ItineraryItem, Trip } from './Trip';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('TripDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		Cache.reset();
	});

	afterEach(() => {
		sandbox.restore();
	});

	const trip1FromApi = Object.assign({}, TripTestData.tripDetail.trip);
	trip1FromApi.id = '111';
	const trip1Expected: Trip = Object.assign({}, TripExpectedResults.tripDetailed);
	trip1Expected.id = '111';

	if (trip1Expected.days) {
		trip1Expected.days = trip1Expected.days.map((day: Day) => {
			const newDay: Day = Object.assign({}, day);
			newDay.itinerary = newDay.itinerary.map((itineraryItem: ItineraryItem) => {
				const newItineraryItem: ItineraryItem = Object.assign({}, itineraryItem);
				delete newItineraryItem.place;
				return newItineraryItem;
			});
			return newDay;
		});
	}

	describe('#getTrips', () => {
		it('should just recall api and return trips', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));

			return chai.expect(Dao.getTrips('', ''))
				.to.eventually.deep.equal(TripExpectedResults.tripList);
		});
	});

	describe('#getTripDetailed', () => {
		it('should get trip response from api if is not in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: trip1FromApi }));
			}));
			const result = Dao.getTripDetailed('111');
			sinon.assert.calledOnce(stub);
			return chai.expect(result).to.eventually.deep.equal(trip1Expected);
		});

		it('should get trip response from cache if it is already in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			tripsDetailedCache.set('111', trip1FromApi);

			const result = Dao.getTripDetailed('111');
			sinon.assert.notCalled(stub);
			return chai.expect(result).to.eventually.deep.equal(trip1Expected);
		});
	});

	describe('#updateTrip', () => {
		it('should put updated trip to cache', () => {
			Dao.updateTrip(TripExpectedResults.tripDetailed);
			return chai.expect(tripsDetailedCache.get(TripExpectedResults.tripDetailed.id))
				.to.be.deep.equal(TripTestData.tripDetail.trip);
		});

		it.skip('should call post on api once', () => true);
	});
});
