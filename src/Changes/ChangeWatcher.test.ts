import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
// import * as cloneDeep from 'lodash.clonedeep';
import * as sinon from 'sinon';
import { SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';
import * as Xhr from '../Xhr';

import { Changes } from '../../index';
import { setEnvironment, setUserSession } from '../Settings';
import { ApiResponse } from '../Xhr/ApiResponse';
import ChangeWatcher from './ChangeWatcher';
import ChangeNotification = Changes.ChangeNotification;

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;
let changeWatcher: ChangeWatcher;
const TICK_INTERVAL = 5000;

describe('ChangeWatcher', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		setUserSession(null, '12345');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		clock = sandbox.useFakeTimers((new Date()).getTime());
	});

	afterEach(() => {
		sandbox.restore();
		clock.restore();
	});

	describe('#start', () => {
		it('should start changes watch and check for changes on api multiple times', async () => {
			changeWatcher = new ChangeWatcher(TICK_INTERVAL, (changeNotifications) => {});

			const stub: SinonStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					changes: ''
				}));
			}));

			await changeWatcher.start();
			clock.tick(24000);
			return chai.expect(stub.callCount).to.be.eq(5);
		});

		it('should start changes watch and get initial changes', (done) => {
			changeWatcher = new ChangeWatcher(TICK_INTERVAL, (changeNotifications: ChangeNotification[]) => {
				chai.expect(changeNotifications).to.eql([{
					type: 'trip',
					id: 'xxx',
					change: 'updated',
					version: 1
				} as ChangeNotification, {
					type: 'favorite',
					id: 'yyy',
					change: 'deleted',
					version: null
				} as ChangeNotification, {
					type: 'settings',
					id: null,
					change: 'updated',
					version: null
				} as ChangeNotification]);
				done();
			});

			sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						changes: [{
							type: 'trip',
							id: 'xxx',
							change: 'updated',
							version: 1
						}, {
							type: 'favorite',
							id: 'yyy',
							change: 'deleted'
						}, {
							type: 'settings',
							id: null,
							change: 'updated'
						}]
					}));
				});
			});
			changeWatcher.start();
		});
	});

	describe('#kill', () => {
		it('should stop changes watching', async () => {
			changeWatcher = new ChangeWatcher(TICK_INTERVAL, () => {});
			const stub: SinonStub = sandbox.stub(Xhr, 'get').callsFake((): Promise<ApiResponse> => {
				return new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						changes: ''
					}));
				});
			});

			await changeWatcher.start();
			clock.tick(24000);
			chai.expect(stub.callCount).to.be.eq(5);
			changeWatcher.kill();
			clock.tick(10000);
			return chai.expect(stub.callCount).to.be.eq(5);
		});
	});
});
