import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';
import { ApiResponse, StApi } from '../Api';
import { Place } from '../Places';
import * as PlacesController from '../Places';

import * as PdfController from '.';
import { GeneratingState } from '.';

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
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#buildDestinationsAndPlaces', () => {
		it('should get all destination with places from trip', async () => {
			const placeIdsAndPlacesFromTrip: Map<string, Place> = new Map<string, Place>();
			const placeFromTrip1: Place = cloneDeep(placeMock);
			placeFromTrip1.id = 'poi:1';
			placeFromTrip1.parents = ['city:1'];
			const placeFromTrip2: Place = cloneDeep(placeMock);
			placeFromTrip2.id = 'poi:2';
			placeFromTrip2.parents = ['city:2'];
			const placeFromTrip3: Place = cloneDeep(placeMock);
			placeFromTrip3.id = 'poi:3';
			placeFromTrip3.parents = ['city:2'];

			placeIdsAndPlacesFromTrip.set(placeFromTrip1.id, placeFromTrip1);
			placeIdsAndPlacesFromTrip.set(placeFromTrip2.id, placeFromTrip2);
			placeIdsAndPlacesFromTrip.set(placeFromTrip3.id, placeFromTrip3);

			const placesDestinationMap: Map<string, Place> = new Map<string, Place>();
			placesDestinationMap.set('poi:1', destination1);
			placesDestinationMap.set('poi:2', destination2);
			placesDestinationMap.set('poi:3', destination2);

			sandbox.stub(PlacesController, 'getPlacesDestinationMap').returns(placesDestinationMap);

			const {
				destinationIdsWithDestinations,
				destinationIdsWithPlaces
			} = await PdfController.buildDestinationsAndPlaces(placeIdsAndPlacesFromTrip);

			chai.expect(destinationIdsWithDestinations.size).to.eq(2);
			chai.expect(Array.from(destinationIdsWithDestinations.keys())).to.deep.eq(['city:1', 'city:2']);
			chai.expect(destinationIdsWithDestinations.get('city:1')).to.have.property('id', 'city:1');
			chai.expect(destinationIdsWithDestinations.get('city:2')).to.have.property('id', 'city:2');

			chai.expect(destinationIdsWithPlaces.size).to.eq(2);
			chai.expect(Array.from(destinationIdsWithPlaces.keys())).to.deep.eq(['city:1', 'city:2']);
			chai.expect(destinationIdsWithPlaces.get('city:1')).to.deep.eq([placeFromTrip1]);
			chai.expect(destinationIdsWithPlaces.get('city:2')).to.deep.eq([placeFromTrip2, placeFromTrip3]);
		});
	});

	describe('#generatePdf', () => {
		it('should return init state if is already done', async () => {
			const apiPostStub: SinonStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, pdfApiResponses.pdfDone));
			}));
			const apiGetStub: SinonStub = sandbox.stub(StApi, 'get');
			const state: GeneratingState = await PdfController.generatePdf('xyz');
			chai.expect(apiPostStub.callCount).to.equal(1);
			chai.expect(apiGetStub.callCount).to.equal(0);
			chai.expect(state).to.deep.equal(pdfResults.pdfDoneResult);
		});

		it('should return init state if is not found', async () => {
			const apiPostStub: SinonStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, pdfApiResponses.pdfNotFound));
			}));
			const apiGetStub: SinonStub = sandbox.stub(StApi, 'get');
			const state: GeneratingState = await PdfController.generatePdf('xyz');
			chai.expect(apiPostStub.callCount).to.equal(1);
			chai.expect(apiGetStub.callCount).to.equal(0);
			chai.expect(state).to.deep.equal(pdfResults.pdfNotFoundResult);
		});
	});
});
