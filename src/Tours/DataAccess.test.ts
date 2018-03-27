import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import * as ToursApiTestData from '../TestData/ToursApiResponses';
import * as ToursExpectedResults from '../TestData/ToursExpectedResults';
import { cloneDeep } from '../Util';
import * as Dao from './DataAccess';
import {
	ToursGetYourGuideQuery, ToursGetYourGuideQuerySortBy, ToursQueryDirection,
	ToursViatorQuery, ToursViatorQuerySortBy
} from './Tour';

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

	describe('#getToursViator', () => {
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

	describe('#getToursGetYourGuide', () => {
		it('should call api with correct parameters', async () => {
			const stub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(ToursApiTestData.toursList)));
			}));

			const toursQuery: ToursGetYourGuideQuery = {
				query: null,
				bounds: null,
				parentPlaceId: 'city:1',
				page: null,
				tags: [],
				count: 10,
				startDate: '2018-03-01',
				endDate: '2018-03-02',
				durationMin: 10,
				durationMax: 100000,
				sortBy: null,
				sortDirection: null
			};

			await Dao.getToursGetYourGuide(toursQuery);
			chai.expect(stub.getCall(0).args[0]).to.equal('tours/get-your-guide?count=10&duration=10%3A100000&' +
				'end_date=2018-03-02&parent_place_id=city%3A1&start_date=2018-03-01');

			toursQuery.bounds = {
				south: 1,
				west: 1,
				north: 2,
				east: 2
			};
			toursQuery.page = 2;
			toursQuery.tags = [1, 2, 3];
			toursQuery.sortBy = ToursGetYourGuideQuerySortBy.PRICE;
			toursQuery.sortDirection = ToursQueryDirection.DESC;
			toursQuery.query = 'test';
			await Dao.getToursGetYourGuide(toursQuery);
			chai.expect(stub.getCall(1).args[0]).to.equal('tours/get-your-guide?bounds=1%2C1%2C2%2C2&count=10' +
				'&duration=10%3A100000&end_date=2018-03-02&page=2&parent_place_id=city%3A1&query=test&' +
				'sort_by=price&sort_direction=desc&start_date=2018-03-01&tags=1%2C2%2C3');
		});
	});

	describe('#getGetYourGuideTagStats', () => {
		it('should call api with correct parameters', async () => {
			const stub: SinonStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { tag_stats: []}));
			}));

			const toursQuery: ToursGetYourGuideQuery = {
				query: null,
				bounds: null,
				parentPlaceId: 'city:1',
				page: null,
				tags: [],
				count: 10,
				startDate: '2018-03-01',
				endDate: '2018-03-02',
				durationMin: 10,
				durationMax: 100000
			};

			await Dao.getGetYourGuideTagStats(toursQuery);
			chai.expect(stub.getCall(0).args[0]).to.equal('tours/get-your-guide/stats?duration=10%3A100000&' +
				'end_date=2018-03-02&parent_place_id=city%3A1&start_date=2018-03-01');

			toursQuery.bounds = {
				south: 1,
				west: 1,
				north: 2,
				east: 2
			};
			toursQuery.page = 2;
			toursQuery.tags = [1, 2, 3];
			toursQuery.query = 'test';
			await Dao.getGetYourGuideTagStats(toursQuery);
			chai.expect(stub.getCall(1).args[0]).to.equal('tours/get-your-guide/stats?bounds=1%2C1%2C2%2C2' +
				'&duration=10%3A100000&end_date=2018-03-02&page=2&parent_place_id=city%3A1&query=test&' +
				'start_date=2018-03-01&tags=1%2C2%2C3');
		});
	});
});
