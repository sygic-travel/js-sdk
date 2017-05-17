import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import * as FavoritesController from '../Favorites';
import { Location } from '../Geo';
import { setEnvironment } from '../Settings/index';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

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

	describe('#getFavoritesIds', () => {
		it('should throw and exception when response without favorites came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			return chai.expect(FavoritesController.getFavoritesIds()).to.be.rejected;
		});

		it('should correctly get data from api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					favorites: [{
						place_id: 'poi:530'
					}, {
						place_id: 'poi:531'
					}]
				}));
			}));

			return chai.expect(FavoritesController.getFavoritesIds()).to.eventually.deep.equal(['poi:530', 'poi:531']);
		});
	});

	describe('#addPlaceToFavorites', () => {
		it('should add place -> call api', (done) => {
			const stub = sandbox.stub(Xhr, 'post'). returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			FavoritesController.addPlaceToFavorites('poi:530');
			sinon.assert.calledOnce(stub);
			done();
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
		it('should remove place -> call api', (done) => {
			const stub = sandbox.stub(Xhr, 'delete_'). returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));

			FavoritesController.removePlaceFromFavorites('poi:530');
			sinon.assert.calledOnce(stub);
			done();
		});
	});
});
