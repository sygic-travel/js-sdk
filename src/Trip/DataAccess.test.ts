import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache, tripsDetailedCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';

// import * as TripTestData from '../TestData/TripApiResponses';
// import * as PlaceTestData from '../TestData/PlacesApiResponses';
import * as TripTestData from '../TestData/TripApiResponses';
// import { Trip } from './Trip';
// import * as TripExpectedResults from '../TestData/TripExpectedResults';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('PlacesDataAccess', () => {
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

	const trip1 = Object.assign({}, TripTestData.tripDetail.trip);
	const trip2 = Object.assign({}, TripTestData.tripDetail.trip);
	trip1.id = '111';
	trip2.id = '222';

	describe('#getTrips', () => {
		it('should just recall api and return trips', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TripTestData.tripsList));
			}));

			return chai.expect(Dao.getTrips('', ''))
				.to.eventually.deep.equal(TripTestData.tripsList.trips);
		});
	});

	describe('#getTripDetailed', () => {
		it('should get trip response from api if is not in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { trip: trip1 }));
			}));
			const result = Dao.getTripDetailed('111');
			sinon.assert.calledOnce(stub);
			return chai.expect(result).to.eventually.deep.equal(trip1);
		});

		it('should get trip response from cache if it is already in cache', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			tripsDetailedCache.set('111', trip1);

			const result = Dao.getTripDetailed('111');
			sinon.assert.notCalled(stub);
			return chai.expect(result).to.eventually.deep.equal(trip1);
		});
	});
});
