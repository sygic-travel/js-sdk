import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import 'mocha';
import * as sinon from 'sinon';
import { cloneDeep } from '../Util';

import { ApiResponse, StApi } from '../Api';
import { setEnvironment } from '../Settings';
import {
	getDetailedPlace,
	getDetailedPlaces,
	getPlaceDestination,
	getPlaces,
	isPlaceDestination,
	mergePlacesArrays,
	Place,
	PlacesListFilterJSON,
	PlacesQuery
} from './index';

import * as TestData from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';
import { Category, Level } from './Place';

let sandbox: sinon.SinonSandbox;
chai.use(chaiAsPromised);
chai.use(dirtyChai);

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

			return chai.expect(getDetailedPlace(guid, photoSize))
				.to.eventually.deep.equal(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		});
	});

	describe('#getPlacesDetailed', () => {
		it('should correctly map api response', () => {

			const place1 = {...TestData.placeDetailedEiffelTowerWithoutMedia.place};
			const place2 = {...TestData.placeDetailedEiffelTowerWithoutMedia.place};
			place1.id = 'poi:1';
			place2.id = 'poi:2';

			const expectedResult1 = {...ExpectedResults.placeDetailedEiffelTowerWithoutMedia};
			const expectedResult2 = {...ExpectedResults.placeDetailedEiffelTowerWithoutMedia};
			expectedResult1.id = 'poi:1';
			expectedResult2.id = 'poi:2';

			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [place1, place2]
				}));
			}));

			return chai.expect(getDetailedPlaces(['poi:1', 'poi:2'], '150x150'))
				.to.eventually.deep.equal([expectedResult1, expectedResult2]);
		});
	});

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: [Category.EATING],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(getPlaces(new PlacesQuery(placesFilterJSON))).to.be.rejected('Should be rejected');
		});

		it('should return array of places', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: [Category.EATING],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(getPlaces(new PlacesQuery(placesFilterJSON)))
				.to.eventually.have.lengthOf(1);
		});

		it('should correctly map api response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestData.places));
			}));

			const placesFilterJSON: PlacesListFilterJSON = {
				categories: [Category.EATING],
				limit: 20,
				parents: ['city:1'],
				tags: []
			};

			return chai.expect(getPlaces(new PlacesQuery(placesFilterJSON)))
				.to.eventually.deep.equal(ExpectedResults.places);
		});
	});

	describe('#isPlaceDestination', () => {
		it('should return true if passed place id is a destination', () => {
			const place: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			place.level = Level.CITY;
			chai.expect(isPlaceDestination(place)).to.be.true('Expected true');
			place.level = Level.TOWN;
			chai.expect(isPlaceDestination(place)).to.be.true('Expected true');
			place.level = Level.VILLAGE;
			chai.expect(isPlaceDestination(place)).to.be.true('Expected true');
			place.level = Level.ISLAND;
			chai.expect(isPlaceDestination(place)).to.be.true('Expected true');
			place.level = Level.POI;
			chai.expect(isPlaceDestination(place)).to.be.false('Expected false');
		});
	});

	describe('#getPlaceDestination', () => {
		it('should return first destination parent of a place', () => {
			const place: Place = cloneDeep(ExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const parentPlacesMap: Map<string, Place> = new Map<string, Place>();

			const parent1: Place = cloneDeep(place);
			parent1.id = 'city:14';
			parent1.level = Level.CITY;
			parentPlacesMap.set(parent1.id, parent1);

			const parent2: Place = cloneDeep(place);
			parent2.id = 'region:303';
			parent2.level = Level.REGION;
			parentPlacesMap.set(parent2.id, parent2);

			const parent3: Place = cloneDeep(place);
			parent3.id = 'city:14';
			parent3.level = Level.CITY;
			parentPlacesMap.set(parent3.id, parent3);

			const parent4: Place = cloneDeep(place);
			parent4.id = 'city:14';
			parent4.level = Level.CITY;
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
