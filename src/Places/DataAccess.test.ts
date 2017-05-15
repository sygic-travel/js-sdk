import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as TestData from '../TestData/PlacesApiResponses';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { PlacesFilter, PlacesFilterJSON } from './Filter';

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

	describe('#getPlaces', () => {
		it('should just recall api and return places', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parent: 'city:1',
				tags: []
			};

			return chai.expect(Dao.getPlaces(new PlacesFilter(placesFilterJSON)))
				.to.eventually.deep.equal(TestData.places.places);
		});
	});

	describe('#getPlaceDetailed', () => {
		it('should get place detailed response from api if it is not in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));
			const guid = 'region:1948650';
			Dao.getPlaceDetailed(guid);

			sinon.assert.calledOnce(stub);
			return chai.expect(Dao.getPlaceDetailed(guid))
				.to.eventually.deep.equal(TestData.placeDetailedEiffelTowerWithoutMedia.place);
		});

		it('should get place detailed response from Cache if it is in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));

			const guid = 'region:1948650';
			Cache.set(guid, TestData.placeDetailedEiffelTowerWithoutMedia.place);

			sinon.assert.notCalled(stub);
			return chai.expect(Dao.getPlaceDetailed(guid))
				.to.eventually.deep.equal(TestData.placeDetailedEiffelTowerWithoutMedia.place);
		});
	});

	describe('#getPlaceDetailedBatch', () => {
		const place1 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
		const place2 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
		const place3 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
		const place4 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
		place1.id = 'poi:1';
		place2.id = 'poi:2';
		place3.id = 'poi:3';
		place4.id = 'poi:4';

		it('should get all places responses from api if they are not in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [place1, place2, place3, place4]
				}));
			}));

			const result = Dao.getPlaceDetailedBatch(['poi:1', 'poi:2', 'poi:3', 'poi:4']);
			sinon.assert.calledOnce(stub);
			return chai.expect(result).to.eventually.deep.equal([
				place1,
				place2,
				place3,
				place4
			]);
		});

		it('should get all place responses from Cache if they are in Cache', () => {
			Cache.set('poi:1', place1);
			Cache.set('poi:2', place2);
			Cache.set('poi:3', place3);
			Cache.set('poi:4', place4);

			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			const result = Dao.getPlaceDetailedBatch(['poi:1', 'poi:2', 'poi:3', 'poi:4']);

			sinon.assert.notCalled(stub);
			return chai.expect(result).to.eventually.deep.equal([
				place1,
				place2,
				place3,
				place4
			]);
		});

		it('should get places that are not in Cache from api', () => {
			Cache.set('poi:1', place1);
			Cache.set('poi:2', place2);

			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [place3, place4]
				}));
			}));

			const result = Dao.getPlaceDetailedBatch(['poi:1', 'poi:2', 'poi:3', 'poi:4']);

			sinon.assert.calledOnce(stub);
			return chai.expect(result).to.eventually.deep.equal([
				place1,
				place2,
				place3,
				place4
			]);
		});
	});

	describe('#getPlaceMedia', () => {
		it('should just recall api and return media', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					media: TestData.placeDetailMedia.media
				}));
			}));

			return chai.expect(Dao.getPlaceMedia('poi:530'))
				.to.eventually.deep.equal(TestData.placeDetailMedia.media);
		});
	});
});
