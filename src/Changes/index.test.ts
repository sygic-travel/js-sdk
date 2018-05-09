import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import { sandbox as sinoSandbox, SinonFakeTimers, SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import { ApiResponse, StApi } from '../Api';

import { initializeChangesWatching, setChangesCallback, stopChangesWatching } from '.';
import { favoritesCache, tripsDetailedCache } from '../Cache';
import { setSession } from '../Session';
import { setEnvironment } from '../Settings';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';
import { ChangeNotification } from './ChangeNotification';

chai.use(dirtyChai);
chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

describe('ChangesController', () => {
	before(() => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
	});

	beforeEach((done) => {
		sandbox = sinoSandbox.create();
		clock = sandbox.useFakeTimers((new Date()).getTime());
		setSession(getFreshSession()).then(() => { done(); });
	});

	afterEach((done) => {
		sandbox.restore();
		clock.restore();
		stopChangesWatching();
		setSession(null).then(() => { done(); });
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
			const fromCache = await tripsDetailedCache.get('xxx');
			chai.expect(fromCache).to.be.null('Expect null');
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
			chai.expect(await favoritesCache.getAll()).to.eql(['poi:1', 'poi:2']);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'updated'
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
			chai.expect(await favoritesCache.getAll()).to.eql([]);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'deleted'
			}])).to.be.true('Expect true');
		});
	});
});
