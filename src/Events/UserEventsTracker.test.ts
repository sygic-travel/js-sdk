import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonFakeTimers, SinonSandbox, SinonStub } from 'sinon';

import { StTrackingApi } from '../Api';
import { cloneDeep } from '../Util';
import { UserEvent, UserEventAction, UserEventCategory, UserEventType } from './UserEvent';
import UserEventsTracker from './UserEventsTracker';

chai.use(chaiAsPromised);

let sandbox: SinonSandbox;
let clock: SinonFakeTimers;
let userEventsTracker: UserEventsTracker;

const testEvent: UserEvent = {
	version: 1,
	type: UserEventType.Event,
	category: UserEventCategory.DETAIL,
	action: UserEventAction.OPEN,
	platform: 'web',
	appVersion: '0.0.1',
	sessionId: 'dawdawd',
	timestamp: 65456465465456,
	label: [
		'ABtest1',
		'ABtest2'
	],
	payload: {
		id: 'poi:530'
	}
};

describe('UserEventsTracker', () => {
	beforeEach(() => {
		sandbox = sinonSandbox.create();
		clock = sandbox.useFakeTimers((new Date()).getTime());
	});

	afterEach(() => {
		sandbox.restore();
		clock.restore();
	});

	describe('#trackEvent', () => {
		it('should start user events tracking and send 5 of them to api', (done) => {
			userEventsTracker = new UserEventsTracker();
			const stub: SinonStub = sandbox.stub(StTrackingApi, 'post').callsFake(() => (
				new Promise<StTrackingApi.StTrackingApiResponseCode>((resolve) => (
					resolve(StTrackingApi.StTrackingApiResponseCode.OK)
				))
			));

			userEventsTracker.startTracking();
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			chai.expect(stub.callCount).to.be.equal(0);
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			chai.expect(stub.callCount).to.be.equal(1);
			done();
		});

		it('should start user events tracking and send 1 of them to api after 20 seconts', (done) => {
			userEventsTracker = new UserEventsTracker();
			const stub: SinonStub = sandbox.stub(StTrackingApi, 'post').callsFake(() => (
				new Promise<StTrackingApi.StTrackingApiResponseCode>((resolve) => (
					resolve(StTrackingApi.StTrackingApiResponseCode.OK)
				))
			));

			userEventsTracker.startTracking();
			userEventsTracker.trackEvent(cloneDeep(testEvent));
			chai.expect(stub.callCount).to.be.equal(0);
			clock.tick(10000);
			chai.expect(stub.callCount).to.be.equal(0);
			clock.tick(20000);
			chai.expect(stub.callCount).to.be.equal(1);
			done();
		});
	});
});
