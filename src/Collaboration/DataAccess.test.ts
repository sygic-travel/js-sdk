import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as Moxios from 'moxios';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as TestApiResponses from '../TestData/CollaborationsApiResponses';
import * as TestExpectedResults from '../TestData/CollaborationsExpectedResults';
import * as Xhr from '../Xhr';

import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('CollaborationDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		Moxios.install(Xhr.axiosInstance);
	});

	afterEach(() => {
		sandbox.restore();
		Moxios.uninstall(Xhr.axiosInstance);
	});

	describe('#followTrip', () => {
		it('should call api with correct tripId', (done) => {
			const tripId = '12345';
			Dao.followTrip(tripId);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('post');
				chai.expect(request.config.url).to.equal(`api/trip/${tripId}/subscription`);
				done();
			});
		});
	});

	describe('#unfollowTrip', () => {
		it('should call api with correct tripId', (done) => {
			const tripId = '12345';
			Dao.unfollowTrip(tripId);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('delete');
				chai.expect(request.config.url).to.equal(`api/trip/${tripId}/subscription`);
				done();
			});
		});
	});

	describe('#getTripCollaborations', () => {
		it('should throw an error when response without collaborations came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {}));
			}));
			return chai.expect(Dao.getTripCollaborations('')).to.be.rejected;
		});

		it('should correctly map collaborations api response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestApiResponses.collaborations));
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

			Dao.addTripCollaboration(tripId, userEmail, accessLevel);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('post');
				const data = JSON.parse(request.config.data);
				chai.expect(data.trip_guid).to.equal(tripId);
				chai.expect(data.user_email).to.equal(userEmail);
				chai.expect(data.access_level).to.equal(accessLevel);
				done();
			});
		});
	});

	describe('#removeTripCollaboration', () => {
		it('should call api with correct collaborationId', (done) => {
			const collaborationId = '12345';
			Dao.removeTripCollaboration(collaborationId);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('delete');
				chai.expect(request.config.url).to.equal(`api/trip-collaborations/${collaborationId}`);
				done();
			});
		});
	});

	describe('#updateTripCollaboration', () => {
		it('should call api with correct parameters', (done) => {
			const collaborationId = '12345';
			const accessLevel = 'xyz';
			Dao.updateTripCollaboration(collaborationId, accessLevel);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('put');
				chai.expect(request.config.url).to.equal(`api/trip-collaborations/${collaborationId}`);
				const data = JSON.parse(request.config.data);
				chai.expect(data.access_level).to.equal(accessLevel);
				done();
			});
		});
	});

	describe('#acceptTripCollaboration', () => {
		it('should call api with correct parameters', (done) => {
			const collaborationId = '12345';
			const hash = '12314212341234';
			Dao.acceptTripCollaboration(collaborationId, hash);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('put');
				chai.expect(request.config.url).to.equal(`api/trip-collaborations/${collaborationId}/accept`);
				const data = JSON.parse(request.config.data);
				chai.expect(data.hash).to.equal(hash);
				done();
			});
		});

		it('should return tripId', () => {
			sandbox.stub(Xhr, 'put').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {
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
			Dao.resendInvitation(collaborationId);
			Moxios.wait(() => {
				const request = Moxios.requests.mostRecent();
				chai.expect(request.config.method).to.equal('post');
				chai.expect(request.config.url).to.equal(`api/trip-collaborations/${collaborationId}/resend-email`);
				done();
			});
		});
	});
});
