import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { cloneDeep } from '../Util';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import * as ToursApiTestData from '../TestData/ToursApiResponses';
import * as ToursExpectedResults from '../TestData/ToursExpectedResults';
import * as Dao from './DataAccess';
import { ToursQuery, ToursQueryDirection, ToursQuerySortBy } from './ToursQuery';

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

	describe('#getTours', () => {
		it('should correctly map tours response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(ToursApiTestData.toursList)));
			}));

			const toursQuery: ToursQuery = {
				parentPlaceId: '123123',
				page: 1,
				sortBy: ToursQuerySortBy.price,
				sortDirection: ToursQueryDirection.asc
			};

			return chai.expect(Dao.getTours(toursQuery))
				.to.eventually.deep.equal(ToursExpectedResults.toursList);
		});
	});
});
