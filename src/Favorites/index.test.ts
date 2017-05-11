import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import * as FavoritesController from '../Favorites';
import { Location } from '../Geo';
import { setEnvironment } from '../Settings/index';
import * as TestData from '../TestData/PlacesApiResponses';
import * as ExpectedResults from '../TestData/PlacesExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

const photoSize: string = '100x100';

describe('FavoritesController', () => {
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

	describe('#getFavorites', () => {
		it('should throw and exception when response without favorites came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			return chai.expect(FavoritesController.getFavorites(photoSize)).to.be.rejected;
		});

		it('should correctly map api response', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get');

			stub.onFirstCall().returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					favorites: [{
						place_id: 'poi:530'
					}]
				}));
			}));

			stub.onSecondCall().returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					places: [
						TestData.placeDetailedEiffelTowerWithoutMedia.place
					]
				}));
			}));

			return chai.expect(FavoritesController.getFavorites(photoSize)).to.eventually.deep.equal([
				ExpectedResults.placeDetailedEiffelTowerWithoutMedia
			]);
		});
	});

	describe('#addPlaceToFavorites', () => {
		it('should add place -> call api and return true', () => {
			sandbox.stub(Xhr, 'post'). returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			return chai.expect(FavoritesController.addPlaceToFavorites('poi:530')).to.eventually.equal(true);
		});
	});

	describe('#addCustomPlaceToFavorites', () => {
		it('should add place -> call api and return true', () => {
			sandbox.stub(Xhr, 'post'). returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					favorite: {
						place_id: 'poi:530'
					}
				}));
			}));

			return chai.expect(FavoritesController.addCustomPlaceToFavorites('xyz', {
				lat: 1,
				lng: 2
			} as Location, 'xyz')).to.eventually.equal('poi:530');
		});
	});

	describe('#removePlaceFromFavorites', () => {
		it('should remove place -> call api and return true', () => {
			sandbox.stub(Xhr, 'delete_'). returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			return chai.expect(FavoritesController.removePlaceFromFavorites('poi:530')).to.eventually.equal(true);
		});
	});
});
