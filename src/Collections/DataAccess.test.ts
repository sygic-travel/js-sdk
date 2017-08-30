import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as Moxios from 'moxios';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as TestData from '../TestData/CollectionsApiResponses';
import * as ExpectedResults from '../TestData/CollectionsExpectedResults';
import * as Xhr from '../Xhr';
import * as PlacesDao from '../Places/DataAccess';
import { Collection } from './Collection';
import { Place } from '../Places';

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

			const result: Collection[] = await Dao.getCollections('city:1', 5, 0, false, '100x100');
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'collections?limit=5&offset=0&placeId=city%3A1');
			chai.expect(result).to.deep.equal(ExpectedResults.collections);
		});
	});
});
