import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as ToursApiTestData from '../TestData/ToursApiResponses';
import * as ToursExpectedResults from '../TestData/ToursExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { ToursQuery } from './ToursQuery';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('TripDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getTours', () => {
		it('should correctly map tours response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(ToursApiTestData.toursList)));
			}));

			const toursQuery: ToursQuery = {
				destinationId: '123123',
				page: 1,
				sortBy: 'price',
				sortDirection: 'asc'
			};

			return chai.expect(Dao.getTours(toursQuery))
				.to.eventually.deep.equal(ToursExpectedResults.toursList);
		});
	});
});
