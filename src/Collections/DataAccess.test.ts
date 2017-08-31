import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as Moxios from 'moxios';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { Place } from '../Places';
import * as PlacesDao from '../Places/DataAccess';
import { setEnvironment } from '../Settings';
import * as TestData from '../TestData/CollectionsApiResponses';
import * as ExpectedResults from '../TestData/CollectionsExpectedResults';
import * as Xhr from '../Xhr';
import { Collection } from './Collection';
import { CollectionsFilter } from './Filter';

import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('CollectionsDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		Moxios.install(Xhr.axiosInstance);
	});

	afterEach(() => {
		sandbox.restore();
		Moxios.uninstall(Xhr.axiosInstance);
	});

	describe('#getCollection', () => {
		it('should correctly get and return collection', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestData.collection));
			}));
			sandbox.stub(PlacesDao, 'getPlacesDetailed').returns(new Promise<Place[]>((resolve) => {
				resolve([]);
			}));

			const result: Collection = await Dao.getCollection(1, '100x100');
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'collections/1');
			chai.expect(result).to.deep.equal(ExpectedResults.collection);
		});
	});

	describe('#getCollections', () => {
		it('should correctly get and return collections', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestData.collections));
			}));

			let filter: CollectionsFilter = new CollectionsFilter({
				placeId: 'city:1',
				limit: 5,
				offset: 5
			});
			let result: Collection[] = await Dao.getCollections(filter, false, '100x100');
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'collections?limit=5&offset=5&place_id=city%3A1');
			chai.expect(result).to.deep.equal(ExpectedResults.collections);

			filter = new CollectionsFilter({
				placeId: 'city:1',
				tags: ['Hotel', 'Historical']
			});
			result = await Dao.getCollections(filter, false, '100x100');
			sinon.assert.calledWith(apiStub, 'collections?place_id=city%3A1&tags=Hotel%2CHistorical');
			chai.expect(result).to.deep.equal(ExpectedResults.collections);
		});
	});
});
