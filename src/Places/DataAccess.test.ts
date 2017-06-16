import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { camelizeKeys } from 'humps';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { placesDetailedCache as Cache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as TestData from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { PlacesFilter, PlacesFilterJSON } from './Filter';
import { Place } from './Place';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

const photoSize = '300x300';

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
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(Dao.getPlaces(new PlacesFilter(placesFilterJSON)))
				.to.eventually.deep.equal(ExpectedResults.places);
		});
	});

	describe('#getPlaceDetailed', () => {
		it('should get place detailed response from api if it is not in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));
			const guid = 'region:1948650';

			return Dao.getPlaceDetailed(guid, photoSize).then((result) => {
				sinon.assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			});
		});

		it('should get place detailed response from Cache if it is in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));

			const guid = 'region:1948650';
			Cache.set(guid, TestData.placeDetailedEiffelTowerWithoutMedia.place);

			sinon.assert.notCalled(stub);
			return chai.expect(Dao.getPlaceDetailed(guid, photoSize))
				.to.eventually.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#getPlacesDetailed', () => {
		const placesFromApi: any[] = [];
		const expectedPlaces: Place[] = [];

		for (let i = 1; i < 5; i++) {
			const placeFormApi = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
			const expectedPlace = Object.assign({}, ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			placeFormApi.id = 'poi:' + i;
			expectedPlace.id = 'poi:' + i;
			placesFromApi.push(placeFormApi);
			expectedPlaces.push(expectedPlace);
		}

		it('should get all places responses from api if they are not in Cache', () => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: placesFromApi
				}));
			}));

			return Dao.getPlacesDetailed(['poi:1', 'poi:2', 'poi:3', 'poi:4'], photoSize).then((result) => {
				sinon.assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(expectedPlaces);
			});
		});

		it('should get all place responses from Cache if they are in Cache', () => {
			Cache.set(placesFromApi[0].id, placesFromApi[0]);
			Cache.set(placesFromApi[1].id, placesFromApi[1]);
			Cache.set(placesFromApi[2].id, placesFromApi[2]);
			Cache.set(placesFromApi[3].id, placesFromApi[3]);

			const stub = sandbox.stub(Xhr, 'get');

			return Dao.getPlacesDetailed(['poi:1', 'poi:2', 'poi:3', 'poi:4'], photoSize).then((result) => {
				sinon.assert.notCalled(stub);
				return chai.expect(result).to.deep.equal(expectedPlaces);
			});
		});

		it('should get places that are not in Cache from api', () => {
			Cache.set(placesFromApi[0].id, placesFromApi[0]);
			Cache.set(placesFromApi[1].id, placesFromApi[1]);

			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [placesFromApi[2], placesFromApi[3]]
				}));
			}));

			return Dao.getPlacesDetailed(['poi:1', 'poi:2', 'poi:3', 'poi:4'], photoSize).then((result) => {
				sinon.assert.calledOnce(stub);
				return chai.expect(result).to.deep.equal(expectedPlaces);
			});
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
				.to.eventually.deep.equal(camelizeKeys(TestData.placeDetailMedia.media));
		});
	});

	describe('#getPlaceGeometry', () => {
		it('should just recall api and return geometry', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					geometry: {
						type: 'Point',
						coordinates: [
							14.4073390859971,
							50.0869010651596
						]
					},
					is_shape: false
				}));
			}));

			return chai.expect(Dao.getPlaceGeometry('poi:42133'))
				.to.eventually.deep.equal({
					geometry: {
						type: 'Point',
						coordinates: [
							14.4073390859971,
							50.0869010651596
						]
					} as GeoJSON.GeoJsonObject,
					isShape: false
				} as PlaceGeometry);
		});
	});

	describe('#getPlaceOpeningHours', () => {
		it('should just recall api and return opening hours', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					opening_hours: {
						'2017-09-01': [{
								opening: '09:00:00',
								closing: '00:00:00',
								note: null
						}],
						'2017-09-02': [{
							opening: '09:00:00',
							closing: '00:00:00',
							note: null
						}]
					}
				}));
			}));
			return chai.expect(Dao.getPlaceOpeningHours('poi:42133', '', ''))
				.to.eventually.deep.equal({
					'2017-09-01': [{
						opening: '09:00:00',
						closing: '00:00:00',
						note: null
					} as DayOpeningHours],
					'2017-09-02': [{
						opening: '09:00:00',
						closing: '00:00:00',
						note: null
					} as DayOpeningHours]
				} as PlaceOpeningHours);
		});
	});
});
