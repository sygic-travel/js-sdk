import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import { Bounds } from '../Geo';
import { Place } from '../Places';
import { setEnvironment } from '../Settings/';
import { placeDetailedEiffelTowerWithoutMedia as placeMock } from '../TestData/PlacesExpectedResults';
import * as Dao from './DataAccess';
import { calculateMapGrid, generateDestinationMainMap, generateDestinationSecondaryMaps } from './MapGenerator';
import { PdfQuery, PdfStaticMap, PdfStaticMapSector } from './PdfData';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('MapGeneratorController', () => {
	const place1: Place = cloneDeep(placeMock);
	place1.id = 'poi:1';
	place1.location = {
		lat: 30,
		lng: 10
	};
	const place2: Place = cloneDeep(placeMock);
	place2.id = 'poi:2';
	place2.location = {
		lat: 30,
		lng: 30
	};
	const place3: Place = cloneDeep(placeMock);
	place3.id = 'poi:3';
	place3.location = {
		lat: 10,
		lng: 10
	};
	const place4: Place = cloneDeep(placeMock);
	place4.id = 'poi:4';
	place4.location = {
		lat: 10,
		lng: 30
	};

	const destinationPlaces: Place[] = [place1, place2, place3, place4];

	const query: PdfQuery = {
		tripId: 'x',
		mainMapWidth: 1000,
		mainMapHeight: 1000,
		gridRowsCount: 2,
		gridColumnsCount: 2,
		secondaryMapWidth: 100,
		secondaryMapHeight: 100
	};

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

	describe('#generateDestinationMainMap', () => {
		it('should generate main static map', async () => {
			sandbox.stub(Dao, 'getStaticMap').returns({
				id: 'main',
				url: 'some_url',
				bounds: {
					south: 0,
					west: 0,
					north: 40,
					east: 40
				} as Bounds,
				sectors: []
			});

			const map: PdfStaticMap = await generateDestinationMainMap(destinationPlaces, query);
			chai.expect(map.sectors.length).to.be.eq(4);

			const sectorA0: PdfStaticMapSector | undefined = map.sectors.find((s: PdfStaticMapSector) => s.id === 'A0');
			const sectorA1: PdfStaticMapSector | undefined = map.sectors.find((s: PdfStaticMapSector) => s.id === 'A1');
			const sectorB0: PdfStaticMapSector | undefined = map.sectors.find((s: PdfStaticMapSector) => s.id === 'B0');
			const sectorB1: PdfStaticMapSector | undefined = map.sectors.find((s: PdfStaticMapSector) => s.id === 'B1');

			chai.expect(sectorA0!.bounds).to.be.deep.eq({
				south: 20,
				west: 0,
				north: 40,
				east: 20
			});
			chai.expect(sectorA1!.bounds).to.be.deep.eq({
				south: 20,
				west: 20,
				north: 40,
				east: 40
			});
			chai.expect(sectorB0!.bounds).to.be.deep.eq({
				south: 0,
				west: 0,
				north: 20,
				east: 20
			});
			chai.expect(sectorB1!.bounds).to.be.deep.eq({
				south: 0,
				west: 20,
				north: 20,
				east: 40
			});

			chai.expect(sectorA0!.places[0]).to.be.deep.eq(place1);
			chai.expect(sectorA1!.places[0]).to.be.deep.eq(place2);
			chai.expect(sectorB0!.places[0]).to.be.deep.eq(place3);
			chai.expect(sectorB1!.places[0]).to.be.deep.eq(place4);
		});
	});

	describe('#generateDestinationSecondaryMaps', () => {
		it('should generate secondary static maps', async () => {
			const stub: SinonStub = sandbox.stub(Dao, 'getStaticMap');
			stub.onCall(0).returns({
				id: 'A0',
				url: 'some_url',
				bounds: {
					south: 0,
					west: 0,
					north: 0,
					east: 0
				} as Bounds,
				sectors: []
			});
			stub.onCall(1).returns({
				id: 'A1',
				url: 'some_url',
				bounds: {
					south: 0,
					west: 0,
					north: 0,
					east: 0
				} as Bounds,
				sectors: []
			});
			stub.onCall(2).returns({
				id: 'B0',
				url: 'some_url',
				bounds: {
					south: 0,
					west: 0,
					north: 0,
					east: 0
				} as Bounds,
				sectors: []
			});
			stub.onCall(3).returns({
				id: 'B1',
				url: 'some_url',
				bounds: {
					south: 0,
					west: 0,
					north: 0,
					east: 0
				} as Bounds,
				sectors: []
			});

			const mainMapSectors: PdfStaticMapSector[] = [{
				id: 'A0',
				places: [place1],
				bounds: {
					south: 20,
					west: 0,
					north: 40,
					east: 20
				}
			}, {
				id: 'A1',
				places: [place2],
				bounds: {
					south: 20,
					west: 20,
					north: 40,
					east: 40
				}
			}, {
				id: 'B0',
				places: [place3],
				bounds: {
					south: 0,
					west: 0,
					north: 20,
					east: 20
				}
			}, {
				id: 'B1',
				places: [place4],
				bounds: {
					south: 0,
					west: 20,
					north: 20,
					east: 40
				}
			}];

			const secondaryMaps: PdfStaticMap[] = await generateDestinationSecondaryMaps(
				destinationPlaces,
				query,
				mainMapSectors
			);

			chai.expect(secondaryMaps.length).to.be.eq(4);
			chai.expect(secondaryMaps[0]).to.haveOwnProperty('id', 'A0');
			chai.expect(secondaryMaps[1]).to.haveOwnProperty('id', 'A1');
			chai.expect(secondaryMaps[2]).to.haveOwnProperty('id', 'B0');
			chai.expect(secondaryMaps[3]).to.haveOwnProperty('id', 'B1');
		});
	});

	describe('#calculateMapGrid', () => {
		it('should calculate grid based on bounds and # of rows and columns', () => {
			const bounds: Bounds = {
				south: 2,
				west: 2,
				north: 4,
				east: 4
			};

			const result: PdfStaticMapSector[] = [{
				id: 'A0',
				bounds: {
					south: 3,
					west: 2,
					north: 4,
					east: 3
				},
				places: []
			}, {
				id: 'A1',
				bounds: {
					south: 3,
					west: 3,
					north: 4,
					east: 4
				},
				places: []
			}, {
				id: 'B0',
				bounds: {
					south: 2,
					west: 2,
					north: 3,
					east: 3
				},
				places: []
			}, {
				id: 'B1',
				bounds: {
					south: 2,
					west: 3,
					north: 3,
					east: 4
				},
				places: []
			}];

			chai.expect(calculateMapGrid(
				bounds,
				2,
				2
			)).to.deep.equal(result);
		});
	});
});
