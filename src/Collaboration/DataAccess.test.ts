import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as dirtyChai from 'dirty-chai';
import { assert, sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { setSession } from '../Session';
import { setEnvironment } from '../Settings';
import * as TestApiResponses from '../TestData/CollaborationsApiResponses';
import * as TestExpectedResults from '../TestData/CollaborationsExpectedResults';
import { getFreshSession } from '../TestData/UserInfoExpectedResults';

import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);
chai.use(dirtyChai);

describe('CollaborationDataAccess', () => {
	before(() => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
	});

	beforeEach((done) => {
		sandbox = sinonSandbox.create();
		setSession(getFreshSession()).then(() => { done(); });
	});

	afterEach((done) => {
		sandbox.restore();
		setSession(null).then(() => { done(); });
	});

	describe('#followTrip', () => {
		it('should call api with correct tripId', (done) => {
			const tripId = '12345';
			const apiStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.followTrip(tripId)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trips/${tripId}/subscription`);
				}).then(done, done);
		});
	});

	describe('#unfollowTrip', () => {
		it('should call api with correct tripId', (done) => {
			const tripId = '12345';
			const apiStub = sandbox.stub(StApi, 'delete_').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.unfollowTrip(tripId)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trips/${tripId}/subscription`);
				}).then(done, done);
		});
	});

	describe('#getTripCollaborations', () => {
		it('should throw an error when response without collaborations came', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {}));
			}));
			return chai.expect(Dao.getTripCollaborations('')).to.be.rejected('Should be rejected');
		});

		it('should correctly map collaborations api response', () => {
			sandbox.stub(StApi, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, TestApiResponses.collaborations));
			}));
			return chai.expect(Dao.getTripCollaborations('111'))
				.to.eventually.deep.equal(TestExpectedResults.collaborations);
		});
	});

	describe('#addTripCollaboration', () => {
		it('should call api with correct parameters', (done) => {
			const tripId = '12345';
			const userEmail = 'test@test.com';
			const accessLevel = 'xyz';
			const expectedRequest = {
				trip_id: tripId,
				user_email: userEmail,
				access_level: accessLevel
			};
			const apiStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.addTripCollaboration(tripId, userEmail, accessLevel)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, 'trip-collaborations', expectedRequest);
				}).then(done, done);
		});
	});

	describe('#removeTripCollaboration', () => {
		it('should call api with correct collaborationId', (done) => {
			const collaborationId = '12345';
			const apiStub = sandbox.stub(StApi, 'delete_').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.removeTripCollaboration(collaborationId)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trip-collaborations/${collaborationId}`);
				}).then(done, done);
		});
	});

	describe('#updateTripCollaboration', () => {
		it('should call api with correct parameters', (done) => {
			const collaborationId = '12345';
			const accessLevel = 'xyz';
			const expectedRequest = {
				access_level: accessLevel
			};
			const apiStub = sandbox.stub(StApi, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.updateTripCollaboration(collaborationId, accessLevel)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trip-collaborations/${collaborationId}`, expectedRequest);
				}).then(done, done);
		});
	});

	describe('#acceptTripCollaboration', () => {
		it('should call api with correct parameters', (done) => {
			const collaborationId = '12345';
			const hash = '12314212341234';
			const expectedRequest = { hash };
			const apiStub = sandbox.stub(StApi, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					collaboration: TestApiResponses.collaborations.collaborations[0]
				}));
			}));

			Dao.acceptTripCollaboration(collaborationId, hash)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trip-collaborations/${collaborationId}/accept`, expectedRequest);
				}).then(done, done);
		});

		it('should return tripId', () => {
			sandbox.stub(StApi, 'put').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, {
					collaboration: TestApiResponses.collaborations.collaborations[0]
				}));
			}));

			const collaborationId = '12345';
			const hash = '12314212341234';
			const resultTripId = '123456';

			return chai.expect(Dao.acceptTripCollaboration(collaborationId, hash)).to.eventually.equal(resultTripId);
		});
	});

	describe('#resendInvitation', () => {
		it('should call api with correct parameters', (done) => {
			const collaborationId = '12345';
			const apiStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, null));
			}));

			Dao.resendInvitation(collaborationId)
				.then(() => {
					assert.calledOnce(apiStub);
					assert.calledWith(apiStub, `trip-collaborations/${collaborationId}/resend-email`);
				}).then(done, done);
		});
	});
});
