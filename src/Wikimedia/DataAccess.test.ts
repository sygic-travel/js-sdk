import * as chai from 'chai';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';
import { cloneDeep } from '../Util';

import { WikimediaResult } from '.';
import { ApiResponse, StApi } from '../Api';
import * as TestApiData from '../TestData/WikimediaApiResponses';
import * as TestResults from '../TestData/WikimediaExpectedResults';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;

describe('WikimediaDataAccess', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getByQuery', () => {
		it('should correctly call api twice and map result', async () => {
			const apiStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(TestApiData)));
			}));
			const results: WikimediaResult[] = await Dao.getByQuery('test');
			chai.expect(apiStub.getCall(0).args[0])
				.to.equal('wikimedia/search-by-query/?domain=commons.wikimedia.org&query=test');
			chai.expect(apiStub.getCall(1).args[0])
				.to.equal('wikimedia/search-by-query/?domain=en.wikipedia.org&query=test');
			chai.expect(results[0]).to.deep.equal(TestResults.wikimedia);
		});

		it('should correctly merge results', async () => {
			const apiWikimedia1 = cloneDeep(TestApiData.wikimedia[0]);
			apiWikimedia1.id = '111';
			const apiWikimedia2 = cloneDeep(TestApiData.wikimedia[0]);
			apiWikimedia2.id = '222';
			const apiWikimedia3 = cloneDeep(TestApiData.wikimedia[0]);
			apiWikimedia3.id = '111';

			const apiResult1: any = {
				wikimedia: [apiWikimedia1]
			};

			const apiResult2: any = {
				wikimedia: [apiWikimedia2, apiWikimedia3]
			};

			const apiStub = sandbox.stub(StApi, 'get');
			apiStub.onCall(0).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiResult1));
			}));
			apiStub.onCall(1).returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiResult2));
			}));

			const results: WikimediaResult[] = await Dao.getByQuery('test');
			chai.expect(results.length).to.equal(2);
			chai.expect(results[0].id).to.equal('111');
			chai.expect(results[1].id).to.equal('222');
		});
	});

	describe('#getByLocation', () => {
		it('should correctly call api twice and map result', async () => {
			const apiStub = sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(TestApiData)));
			}));
			const results: WikimediaResult[] = await Dao.getByLocation({lat: 1, lng: 2});
			chai.expect(apiStub.getCall(0).args[0])
				.to.equal('wikimedia/search-by-location/?domain=commons.wikimedia.org&location=1%2C2');
			chai.expect(apiStub.getCall(1).args[0])
				.to.equal('wikimedia/search-by-location/?domain=en.wikipedia.org&location=1%2C2');
			chai.expect(results[0]).to.deep.equal(TestResults.wikimedia);
			chai.expect(results.length).to.equal(1);
		});
	});
});
