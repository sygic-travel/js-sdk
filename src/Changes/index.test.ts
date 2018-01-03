import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinoSandbox, SinonFakeTimers, SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import { ApiResponse, StApi } from '../Api';

import { initializeChangesWatching, setChangesCallback, stopChangesWatching } from '.';
import { favoritesCache, tripsDetailedCache } from '../Cache';
import { setEnvironment } from '../Settings';
import { setUserSession } from '../User/DataAccess';
import { ChangeNotification } from './ChangeNotification';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

describe('ChangesController', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		setUserSession({
			accessToken: '12345',
			refreshToken: '54321'
		});
		done();
	});

	beforeEach(() => {
		sandbox = sinoSandbox.create();
		clock = sandbox.useFakeTimers((new Date()).getTime());
	});

	afterEach(() => {
		sandbox.restore();
		clock.restore();
		stopChangesWatching();
		tripsDetailedCache.reset();
		favoritesCache.reset();
	});

	describe('#initializeChangesWatching', () => {
		it('should throw an error when passed tick interval is smaller than minimal interval limit', () => {
			return chai.expect(initializeChangesWatching(1000)).to.be.rejected('Should be rejected');
		});

		it('should start changes watch and check for changes multiple times', (done) => {
			const stub: SinonStub = sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						changes: ''
					}));
				});
			});
			initializeChangesWatching(5000).then(() => {
				clock.tick(24000);
				clock.restore();
				setTimeout(() => {
					chai.expect(stub.callCount).to.be.eq(5);
					done();
				}, 100);
			});
		});
	});

	describe('#handleChanges', () => {
		const tripChangesResponses = [{
			changes: [{
				type: 'trip',
				id: 'xxx',
				change: 'updated',
				version: 3
			}]
		}, {
			changes: [{
				type: 'trip',
				id: 'xxx',
				change: 'deleted',
				version: 3
			}]
		}];

		const favoritesChangesResponses = [{
			changes: [{
				type: 'favorite',
				id: 'poi:530',
				change: 'updated',
			}]
		}, {
			changes: [{
				type: 'favorite',
				id: 'poi:530',
				change: 'deleted',
			}]
		}];

		it('should not handle changes after trip change is made locally', async () => {
			tripsDetailedCache.set('xxx', { version: 3 });
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponses[0]));
				});
			});
			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.notCalled).to.be.true('Expect true');
		});

		it('should handle changes after trip change is made remotely', async () => {
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponses[0]));
				});
			});
			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([{
				type: 'trip',
				id: 'xxx',
				change: 'updated',
				version: 3
			} as ChangeNotification])).to.be.true('Expect true');
		});

		it('should not handle changes after trip was deleted locally', async () => {
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.notCalled).to.be.true('Expect true');
		});

		it('should handle changes after trip was deleted remotely', async () => {
			tripsDetailedCache.set('xxx', { version: 3 });
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			chai.expect(tripsDetailedCache.get('xxx')).to.eventually.be.null('Expect null');
			return chai.expect(spy.calledWithExactly([{
				type: 'trip',
				id: 'xxx',
				change: 'deleted',
				version: 3
			} as ChangeNotification])).to.be.true('Expect true');
		});

		it('should not handle changes after favorite was added locally', async () => {
			favoritesCache.set('poi:530', 'poi:530');
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[0]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.notCalled).to.be.true('Expect true');
		});

		it('should handle changes after favorite was added remotely', async () => {
			const stub: SinonStub = sandbox.stub(StApi, 'get');

			stub.onFirstCall().callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[0]));
				});
			});
			stub.onSecondCall().callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						favorites: [
							{ place_id: 'poi:1'},
							{ place_id: 'poi:2'}
						]
					}));
				});
			});
			stub.onThirdCall().callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						changes: []
					}));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			chai.expect(favoritesCache.getAll()).to.eventually.eql(['poi:1', 'poi:2']);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'updated',
				version: null
			} as ChangeNotification])).to.be.true('Expect true');
		});

		it('should not handle changes when favorite was removed locally', async () => {
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.notCalled).to.be.true('Expect true');
		});

		it('should handle changes when favorite was removed remotely', async () => {
			favoritesCache.set('poi:530', 'poi:530');
			sandbox.stub(StApi, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			chai.expect(favoritesCache.getAll()).to.eventually.eql([]);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'deleted',
				version: null
			}])).to.be.true('Expect true');
		});
	});
});
