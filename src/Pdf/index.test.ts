import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import { buildDestinationsAndPlaces, findAndSetMissingAddresses, generatePdf, GeneratingState } from '.';
import { ApiResponse, StApi } from '../Api';
import * as FavoritesController from '../Favorites';
import * as PlacesController from '../Places';
import * as SearchController from '../Search';
import * as User from '../Session';
import { setEnvironment } from '../Settings/';
import * as pdfApiResponses from '../TestData/PdfApiResponses';
import * as pdfResults from '../TestData/PdfExpectedResults';
import { placeDetailedEiffelTowerWithoutMedia as placeMock } from '../TestData/PlacesExpectedResults';
import { cloneDeep } from '../Util';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('PdfController', () => {
	const destination1: PlacesController.Place = cloneDeep(placeMock);
	destination1.id = 'city:1';
	const destination2: PlacesController.Place = cloneDeep(placeMock);
	destination2.id = 'city:2';
	const destination3: PlacesController.Place = cloneDeep(placeMock);
	destination3.id = 'city:3';
	const destination4: PlacesController.Place = cloneDeep(placeMock);
	destination4.id = 'city:4';

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

	describe('#buildDestinationsAndPlaces', () => {
		it('should get all destination with places from trip', async () => {
			const placeIdsAndPlacesFromTrip: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			const placeFromTrip1: PlacesController.Place = cloneDeep(placeMock);
			placeFromTrip1.id = 'poi:1';
			placeFromTrip1.parents = [{
				id: 'city:1',
				name: null,
				level: null
			} as PlacesController.Parent];
			const placeFromTrip2: PlacesController.Place = cloneDeep(placeMock);
			placeFromTrip2.id = 'poi:2';
			placeFromTrip2.parents = [{
				id: 'city:2',
				name: null,
				level: null
			} as PlacesController.Parent];
			const placeFromTrip3: PlacesController.Place = cloneDeep(placeMock);
			placeFromTrip3.id = 'poi:3';
			placeFromTrip3.parents = [{
				id: 'city:2',
				name: null,
				level: null
			} as PlacesController.Parent];

			placeIdsAndPlacesFromTrip.set(placeFromTrip1.id, placeFromTrip1);
			placeIdsAndPlacesFromTrip.set(placeFromTrip2.id, placeFromTrip2);
			placeIdsAndPlacesFromTrip.set(placeFromTrip3.id, placeFromTrip3);

			const placesDestinationMap: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			placesDestinationMap.set('poi:1', destination1);
			placesDestinationMap.set('poi:2', destination2);
			placesDestinationMap.set('poi:3', destination2);

			const placeFromFavorites1: PlacesController.Place = cloneDeep(placeMock);
			placeFromFavorites1.id = 'poi:1234';
			placeFromFavorites1.parents = [{
				id: 'city:1',
				name: null,
				level: null
			} as PlacesController.Parent];
			const favoritesDetailedMap: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			favoritesDetailedMap.set(placeFromFavorites1.id, placeFromFavorites1);
			const favoritesDestinationMap: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			favoritesDestinationMap.set(placeFromFavorites1.id, destination1);

			const homeDestination: PlacesController.Place = cloneDeep(placeMock);
			homeDestination.id = 'country:999';
			const homeDestinationMap: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			homeDestinationMap.set('poi:999', homeDestination);

			sandbox.stub(User, 'getUserSettings').returns(new Promise<User.UserSettings>((resolve) => {
				resolve({homePlaceId: 'poi:999', workPlaceId: null});
			}));

			sandbox.stub(PlacesController, 'getPlacesDestinationMap')
				.onFirstCall().returns(placesDestinationMap)
				.onSecondCall().returns(favoritesDestinationMap)
				.onThirdCall().returns(homeDestinationMap);
			sandbox.stub(FavoritesController, 'getFavoritesIds').returns(new Promise<string[]>((resolve) =>
				(resolve(['poi:1234']))
			));
			sandbox.stub(PlacesController, 'getDetailedPlacesMap').returns(favoritesDetailedMap);

			const {
				destinationIdsWithDestinations,
				destinationIdsWithPlaces
			} = await buildDestinationsAndPlaces(placeIdsAndPlacesFromTrip);

			chai.expect(destinationIdsWithDestinations.size).to.eq(2);
			chai.expect(Array.from(destinationIdsWithDestinations.keys())).to.deep.eq(['city:1', 'city:2']);
			chai.expect(destinationIdsWithDestinations.get('city:1')).to.have.property('id', 'city:1');
			chai.expect(destinationIdsWithDestinations.get('city:2')).to.have.property('id', 'city:2');

			chai.expect(destinationIdsWithPlaces.size).to.eq(2);
			chai.expect(Array.from(destinationIdsWithPlaces.keys())).to.deep.eq(['city:1', 'city:2']);
			chai.expect(destinationIdsWithPlaces.get('city:1')).to.deep.eq([placeFromTrip1, placeFromFavorites1]);
			chai.expect(destinationIdsWithPlaces.get('city:2')).to.deep.eq([placeFromTrip2, placeFromTrip3]);
		});
	});

	describe('#generatePdf', () => {
		it('should return init state if is already done', async () => {
			const apiPostStub: SinonStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, pdfApiResponses.pdfDone));
			}));
			const apiGetStub: SinonStub = sandbox.stub(StApi, 'get');
			const state: GeneratingState = await generatePdf('xyz');
			chai.expect(apiPostStub.callCount).to.equal(1);
			chai.expect(apiGetStub.callCount).to.equal(0);
			chai.expect(state).to.deep.equal(pdfResults.pdfDoneResult);
		});

		it('should return init state if is not found', async () => {
			const apiPostStub: SinonStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, pdfApiResponses.pdfNotFound));
			}));
			const apiGetStub: SinonStub = sandbox.stub(StApi, 'get');
			const state: GeneratingState = await generatePdf('xyz');
			chai.expect(apiPostStub.callCount).to.equal(1);
			chai.expect(apiGetStub.callCount).to.equal(0);
			chai.expect(state).to.deep.equal(pdfResults.pdfNotFoundResult);
		});
	});

	describe('#findAndSetMissingAddresses', () => {
		it('should not fail if searchReverse fails', async () => {
			sandbox.stub(
				SearchController,
				'searchReverse'
			).returns(new Promise<ApiResponse>((resolve, reject) => {
				reject();
			}));

			const place1: PlacesController.Place = cloneDeep(placeMock);
			const place2: PlacesController.Place = cloneDeep(placeMock);
			place2.detail!.address = null;

			const places: PlacesController.Place[] = await findAndSetMissingAddresses([place1, place2]);
			chai.expect(places[0].detail!.address).to.not.be.null;
			chai.expect(places[1].detail!.address).to.be.null;
		});

		it('should fill places addresses if they are empty ', async () => {
			sandbox.stub(
				SearchController,
				'searchReverse'
			).returns(new Promise<SearchController.SearchResult[]>((resolve) => {
				const searchResults: SearchController.SearchResult[] = [{
					address: {
						short: 'test address',
						full: 'test address',
						fields: {
							name: null,
							houseNumber: null,
							street: null,
							city: null,
							state: null,
							postalCode: null,
							country: null
						}
					},
					location: { lat: 0, lng: 0},
					type: null,
					distance: null,
					place: null
				}];
				resolve(searchResults);
			}));

			const place1: PlacesController.Place = cloneDeep(placeMock);
			const place2: PlacesController.Place = cloneDeep(placeMock);
			place1.detail!.address = null;
			place2.detail!.address = null;

			const places: PlacesController.Place[] = await findAndSetMissingAddresses([place1, place2]);
			chai.expect(places[0].detail!.address).to.eq('test address');
			chai.expect(places[1].detail!.address).to.eq('test address');
		});
	});
});
