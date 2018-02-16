import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { cloneDeep } from '../Util';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import * as ToursApiTestData from '../TestData/ToursApiResponses';
import * as ToursExpectedResults from '../TestData/ToursExpectedResults';
import * as Dao from './DataAccess';
import { ToursQueryDirection, ToursViatorQuery, ToursViatorQuerySortBy } from './Tour';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('TripDataAccess', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getViatorTours', () => {
		it('should correctly map tours response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(ToursApiTestData.toursList)));
			}));

			const toursQuery: ToursViatorQuery = {
				parentPlaceId: '123123',
				page: 1,
				sortBy: ToursViatorQuerySortBy.PRICE,
				sortDirection: ToursQueryDirection.ASC
			};

			return chai.expect(Dao.getToursViator(toursQuery))
				.to.eventually.deep.equal(ToursExpectedResults.toursList);
		});
	});
});
