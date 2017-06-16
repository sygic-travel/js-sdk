import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox, SinonStub } from 'sinon';
import * as sinon from 'sinon';

import { favoritesCache } from '../Cache';
import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('FavoritesDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
		favoritesCache.reset();
	});

	const apiData = {
		favorites: [
			{ place_id: 'poi:1'},
			{ place_id: 'poi:2'}
		]
	};

	const favoritesData = ['poi:1', 'poi:2'];

	describe('#handleFavoritesChanges', () => {
		it('should reload all favorites guids from api', () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, apiData));
			}));

			return Dao.handleFavoritesChanges().then(() => {
				sinon.assert.calledOnce(stub);
				chai.expect(favoritesCache.get('favorites')).to.eventually.deep.equal(favoritesData);
			});
		});

	});
});
