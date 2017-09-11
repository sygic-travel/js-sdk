import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { Location } from '../Geo';
import { setEnvironment } from '../Settings';
import * as TestApiExpectedResults from '../TestData/SearchLocationExpectedResults';
import * as TestApiResponses from '../TestData/SearchLocationsApiResponses';
import * as Xhr from '../Xhr';
import * as Dao from './DataAccess';
import { SearchTagsResult } from './SearchResult';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('SearchDataAccess', () => {
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

	const query = 'eiffel tower';
	const location = {
		lat: 50.088762,
		lng: 14.421861
	} as Location;

	describe('#search', () => {
		it('should throw and exception when response without searched locations came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {}));
			}));

			return chai.expect(Dao.search(query, location)).to.be.rejected;
		});

		it('should correctly map search response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestApiResponses.searchLocations));
			}));

			return chai.expect(Dao.search(query, location))
				.to.eventually.deep.equal(TestApiExpectedResults.searchLocations);
		});
	});

	describe('#searchReverse', () => {
		it('should throw and exception when response without searched locations came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {}));
			}));

			return chai.expect(Dao.searchReverse(location)).to.be.rejected;
		});

		it('should correctly map search response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestApiResponses.searchLocations));
			}));

			return chai.expect(Dao.searchReverse(location))
				.to.eventually.deep.equal(TestApiExpectedResults.searchLocations);
		});
	});

	describe('#searchTags', () => {
		it('should recall api and return search tags results', async () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {
					tags: [{
						key: 'Dinner Theater',
						name: 'Dinner Theater',
						priority: 0,
						is_visible: true
					}, {
						key: 'Theater, Show & Musical',
						name: 'Theater, Show & Musical',
						priority: 0,
						is_visible: true
					}]
				}));
			}));

			return chai.expect(await Dao.searchTags('eat')).to.deep.equal([{
					key: 'Dinner Theater',
					name: 'Dinner Theater',
					priority: 0,
					isVisible: true
				} as SearchTagsResult, {
					key: 'Theater, Show & Musical',
					name: 'Theater, Show & Musical',
					priority: 0,
					isVisible: true
				} as SearchTagsResult]
			);
		});
	});
});
