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
import { PlacesListFilter, PlacesListFilterJSON } from './ListFilter';
import { CustomPlaceFormData, Place } from './Place';
import { PlaceGeometry } from './PlaceGeometry';
import { DayOpeningHours, PlaceOpeningHours } from './PlaceOpeningHours';
import { PlacesStatsFilter } from './StatsFilter';

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

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(Dao.getPlaces(new PlacesListFilter(placesFilterJSON)))
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

	describe('#addPlaceReview', () => {
		it('should correctly add item review', () => {
			sandbox.stub(Xhr, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeReview));
			}));
			return chai.expect(Dao.addPlaceReview('poi:123', 1, 'test'))
				.to.eventually.deep.equal(ExpectedResults.placeReview);
		});
	});

	describe('#getPlaceReviews', () => {
		it('should correctly get and map item reviews with additional data', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeReviewsData));
			}));
			return chai.expect(Dao.getPlaceReviews('poi:540', 1, 1))
				.to.eventually.deep.equal(ExpectedResults.placeReviewsData);
		});
	});

	describe('#getPlacesStats', () => {
		it('should correctly get and map stats data for places', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placesStatsData));
			}));
			return chai.expect(Dao.getPlacesStats(new PlacesStatsFilter({query: 'test'})))
				.to.eventually.deep.equal(ExpectedResults.placesStatsData);
		});
	});

	describe('#createCustomPlace', () => {
		it('should correctly create an custom place', () => {
			const formData: CustomPlaceFormData = {
				name: 'Antananarivo',
				location: {
					lat: -18.894964,
					lng: 47.51632
				}
			};
			sandbox.stub(Xhr, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.customPlaceData));
			}));
			return chai.expect(Dao.createCustomPlace(formData))
				.to.eventually.deep.equal(ExpectedResults.customPlace);
		});
	});

	describe('#updateCustomPlace', () => {
		it('should correctly update the custom place', () => {
			const formData: CustomPlaceFormData = {
				name: 'Antananarivo',
				location: {
					lat: -18.894964,
					lng: 47.51632
				}
			};
			sandbox.stub(Xhr, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.customPlaceData));
			}));
			return chai.expect(Dao.updateCustomPlace('c:1', formData))
				.to.eventually.deep.equal(ExpectedResults.customPlace);
		});
	});

	describe('#deleteCustomPlace', () => {
		it('should correctly call api delete and remove from cache', async () => {
			const cacheSpy = sinon.spy(Cache, 'remove');
			const apiStub = sandbox.stub(Xhr, 'delete_').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			await Dao.deleteCustomPlace('c:1');
			chai.expect(cacheSpy.callCount).to.equal(1);
			chai.expect(apiStub.callCount).to.equal(1);
		});
	});

	describe('#detectParentsByLocation', () => {
		it('should correctly get and return places', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const result: Place[] = await Dao.detectParentsByLocation({lat: 49.123, lng: 15.321});
			sinon.assert.calledOnce(apiStub);
			sinon.assert.calledWith(apiStub, 'places/detect-parents?location=49.123%2C15.321');
			chai.expect(result).to.deep.equal(ExpectedResults.places);
		});
	});
});
