import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { SinonFakeTimers, SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import * as Xhr from '../Xhr';

import { initializeChangesWatching, setChangesCallback, stopChangesWatching } from '.';
import { favoritesCache, tripsDetailedCache } from '../Cache';
import { setEnvironment, setUserSession } from '../Settings';
import { ApiResponse } from '../Xhr/ApiResponse';
import { ChangeNotification } from './ChangeNotification';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;

describe('ChangesController', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		setUserSession(null, '12345');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		clock = sinon.useFakeTimers((new Date()).getTime());
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
			return chai.expect(initializeChangesWatching(1000)).to.be.rejected;
		});

		it('should start changes watch and check for changes multiple times', async () => {
			const stub: SinonStub = sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						changes: ''
					}));
				});
			});
			await initializeChangesWatching(5000);
			clock.tick(24000);
			chai.expect(stub.callCount).to.be.eq(5);
		});
	});

	describe('#handleChanges', () => {
		const tripChangesResponse = {
			changes: [{
				type: 'trip',
				id: 'xxx',
				change: 'updated',
				version: 3
			}]
		};

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
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponse));
				});
			});
			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([])).to.be.true;
		});

		it('should handle changes after trip change is made remotely', async () => {
			tripsDetailedCache.set('yyy', { version: 3 });
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, tripChangesResponse));
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
			} as ChangeNotification])).to.be.true;
		});

		it('should not handle changes after favorite was added locally', async () => {
			favoritesCache.set('favorites', ['poi:530']);
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[0]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([])).to.be.true;
		});

		it('should handle changes after favorite was added remotely', async () => {
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[0]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'updated',
				version: null
			} as ChangeNotification])).to.be.true;
		});

		it('should not handle changes when favorite was removed locally', async () => {
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([])).to.be.true;
		});

		it('should handle changes when favorite was removed remotely', async () => {
			favoritesCache.set('favorites', ['poi:530']);
			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, favoritesChangesResponses[1]));
				});
			});

			const spy: SinonSpy = sandbox.spy();
			setChangesCallback(spy);

			await initializeChangesWatching(5000);
			clock.tick(6000);
			return chai.expect(spy.calledWithExactly([{
				type: 'favorite',
				id: 'poi:530',
				change: 'deleted',
				version: null
			}])).to.be.true;
		});
	});
});
