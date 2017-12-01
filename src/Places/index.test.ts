import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import {getPlaceDestination, isPlaceDestination, PlacesListFilter, PlacesListFilterJSON} from '.';
import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import { mergePlacesArrays } from './index';
import * as PlacesController from './index';

import { Place } from '.';
import * as TestData from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('PlacesController', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getPlaceDetailed', () => {
		it('should correctly map api response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.placeDetailedEiffelTowerWithoutMedia));
			}));

			const guid = 'region:1948650';
			const photoSize = '150x150';

			return chai.expect(PlacesController.getPlaceDetailed(guid, photoSize))
				.to.eventually.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#getPlacesDetailed', () => {
		it('should correctly map api response', () => {

			const place1 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
			const place2 = Object.assign({}, TestData.placeDetailedEiffelTowerWithoutMedia.place);
			place1.id = 'poi:1';
			place2.id = 'poi:2';

			const expectedResult1 = Object.assign({}, ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedResult2 = Object.assign({}, ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			expectedResult1.id = 'poi:1';
			expectedResult2.id = 'poi:2';

			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [place1, place2]
				}));
			}));

			return chai.expect(PlacesController.getPlacesDetailed(['poi:1', 'poi:2'], '150x150'))
				.to.eventually.deep.equal([expectedResult1, expectedResult2]);
		});
	});

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON))).to.be.rejected;
		});

		it('should return array of places', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON)))
				.to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: ['eating'],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(PlacesController.getPlaces(new PlacesListFilter(placesFilterJSON)))
				.to.eventually.deep.equal(ExpectedResults.places);
		});
	});

	describe('#isPlaceDestination', () => {
		it('should return true if passed place id is a destination', () => {
			const place: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place.level = 'city';
			chai.expect(isPlaceDestination(place)).to.be.true;
			place.level = 'town';
			chai.expect(isPlaceDestination(place)).to.be.true;
			place.level = 'village';
			chai.expect(isPlaceDestination(place)).to.be.true;
			place.level = 'island';
			chai.expect(isPlaceDestination(place)).to.be.true;
			place.level = 'poi';
			chai.expect(isPlaceDestination(place)).to.be.false;
		});
	});

	describe('#getPlaceDestination', () => {
		it('should return first destination parent of a place', () => {
			const place: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const parentPlacesMap: Map<string, Place> = new Map<string, Place>();

			const parent1: Place = cloneDeep(place);
			parent1.id = 'city:14';
			parent1.level = 'city';
			parentPlacesMap.set(parent1.id, parent1);

			const parent2: Place = cloneDeep(place);
			parent2.id = 'region:303';
			parent2.level = 'region';
			parentPlacesMap.set(parent2.id, parent2);

			const parent3: Place = cloneDeep(place);
			parent3.id = 'city:14';
			parent3.level = 'city';
			parentPlacesMap.set(parent3.id, parent3);

			const parent4: Place = cloneDeep(place);
			parent4.id = 'city:14';
			parent4.level = 'city';
			parentPlacesMap.set(parent4.id, parent4);

			chai.expect(getPlaceDestination(place, parentPlacesMap)).to.equal(parent4);
		});
	});

	describe('#mergePlacesArrays', () => {
		it('should correctly merge 2 arrays of Places without duplicates', () => {
			const place1: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place1.id = 'poi:1';
			const place2: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place2.id = 'poi:2';
			const place3: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place3.id = 'poi:3';
			const place4: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place4.id = 'poi:4';
			const place5: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place5.id = 'poi:5';

			const places1: Place[] = [place1, place2, place3, place4];
			const places2: Place[] = [place2, place3, place4, place1, place5];

			chai.expect(mergePlacesArrays(places1, places2)).to.deep.eq([
				place1, place2, place3, place4, place5
			]);
		});

		it('should correctly merge empty array with array of Places', () => {
			const place1: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place1.id = 'poi:1';
			const place2: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place2.id = 'poi:2';

			chai.expect(mergePlacesArrays([place1, place2], [])).to.deep.eq([place1, place2]);
			chai.expect(mergePlacesArrays([], [place1, place2])).to.deep.eq([place1, place2]);
		});
	});

});
