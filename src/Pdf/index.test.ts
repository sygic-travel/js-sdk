import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { cloneDeep } from '../Util';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';
import { ApiResponse, StApi } from '../Api';
import * as FavoritesController from '../Favorites';
import * as PlacesController from '../Places';

import { buildDestinationsAndPlaces, generatePdf, GeneratingState } from '.';

import * as User from '../Session';
import { setEnvironment } from '../Settings/';
import * as pdfApiResponses from '../TestData/PdfApiResponses';
import * as pdfResults from '../TestData/PdfExpectedResults';
import { placeDetailedEiffelTowerWithoutMedia as placeMock } from '../TestData/PlacesExpectedResults';

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
			placeFromTrip1.parents = ['city:1'];
			const placeFromTrip2: PlacesController.Place = cloneDeep(placeMock);
			placeFromTrip2.id = 'poi:2';
			placeFromTrip2.parents = ['city:2'];
			const placeFromTrip3: PlacesController.Place = cloneDeep(placeMock);
			placeFromTrip3.id = 'poi:3';
			placeFromTrip3.parents = ['city:2'];

			placeIdsAndPlacesFromTrip.set(placeFromTrip1.id, placeFromTrip1);
			placeIdsAndPlacesFromTrip.set(placeFromTrip2.id, placeFromTrip2);
			placeIdsAndPlacesFromTrip.set(placeFromTrip3.id, placeFromTrip3);

			const placesDestinationMap: Map<string, PlacesController.Place> = new Map<string, PlacesController.Place>();
			placesDestinationMap.set('poi:1', destination1);
			placesDestinationMap.set('poi:2', destination2);
			placesDestinationMap.set('poi:3', destination2);

			const placeFromFavorites1: PlacesController.Place = cloneDeep(placeMock);
			placeFromFavorites1.id = 'poi:1234';
			placeFromFavorites1.parents = ['city:1'];
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
});
