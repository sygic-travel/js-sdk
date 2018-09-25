import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox, SinonStub } from 'sinon';

import { ApiResponse, StApi } from '../Api';
import { License } from '../Media';
import { setEnvironment } from '../Settings';

import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
let apiStub: SinonStub;
chai.use(chaiAsPromised);

describe('CrowdsourcingDataAccess', () => {
	before((done) => {
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	beforeEach(() => {
		sandbox = sinonSandbox.create();
		apiStub = sandbox.stub(StApi, 'post').returns(new Promise<ApiResponse>((resolve) => {
			resolve(new ApiResponse(200, {
				place_id: 'poi:530'
			}));
		}));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#createPlace', () => {
		it('should call stApi with correct args', async () => {
			await Dao.createPlace({
				lat: 10,
				lng: 10
			}, 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:create',
				suggested: {
					location: {
						lat: 10,
						lng: 10
					}
				},
				note: 'test'
			});
		});
	});

	describe('#updatePlaceAddress', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceAddress('poi:530', 'address 1', 'address 2', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:address',
				place_id: 'poi:530',
				original: 'address 1',
				suggested: 'address 2',
				note: 'test'
			});
		});
	});

	describe('#updatePlaceAdmission', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceAdmission('poi:530', 'admission 1', 'admission 2', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:admission',
				place_id: 'poi:530',
				original: 'admission 1',
				suggested: 'admission 2',
				note: 'test'
			});
		});
	});

	describe('#updatePlaceEmail', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceEmail('poi:530', 'email1@test.com', 'email2@test.com', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:email',
				place_id: 'poi:530',
				original: 'email1@test.com',
				suggested: 'email2@test.com',
				note: 'test'
			});
		});
	});

	describe('#updatePlaceLocation', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceLocation('poi:530', {
				lat: 1,
				lng: 1
			}, {
				lat: 2,
				lng: 2
			}, 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:location',
				place_id: 'poi:530',
				original: {
					lat: 1,
					lng: 1
				},
				suggested: {
					lat: 2,
					lng: 2
				},
				note: 'test'
			});
		});
	});

	describe('#updatePlaceName', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceName('poi:530', 'en', 'name 1', 'name 2', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:name',
				language_id: 'en',
				place_id: 'poi:530',
				original: 'name 1',
				suggested: 'name 2',
				note: 'test'
			});
		});
	});

	describe('#updatePlaceOpeningHours', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceOpeningHours('poi:530', 'opening hours 1', 'opening hours 1', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:opening_hours',
				place_id: 'poi:530',
				original: 'opening hours 1',
				suggested: 'opening hours 1',
				note: 'test'
			});
		});
	});

	describe('#updatePlaceOpeningHoursNote', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceOpeningHoursNote('poi:530', 'opening hours note 1', 'opening hours note 2', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:opening_hours_note',
				place_id: 'poi:530',
				original: 'opening hours note 1',
				suggested: 'opening hours note 2',
				note: 'test'
			});
		});
	});

	describe('#updatePlacePhone', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlacePhone('poi:530', 'phone 1', 'phone 2', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:phone',
				place_id: 'poi:530',
				original: 'phone 1',
				suggested: 'phone 2',
				note: 'test'
			});
		});
	});

	describe('#createPlaceReference', () => {
		it('should call stApi with correct args', async () => {
			await Dao.createPlaceReference(
				'poi:530',
				'en',
				'link:facebook',
				'facebook.com',
				'test'
			);
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:references',
				place_id: 'poi:530',
				language_id: 'en',
				original: {
					url: null
				},
				suggested: {
					type: 'link:facebook',
					url: 'facebook.com'
				},
				note: 'test'
			});
		});
	});

	describe('#updatePlaceReference', () => {
		it('should call stApi with correct args', async () => {
			await Dao.updatePlaceReference(
				'poi:530',
				'en',
				'facebook.com',
				'link:facebook',
				'google.com',
				'test'
			);
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place:update:references',
				place_id: 'poi:530',
				language_id: 'en',
				original: {
					url: 'facebook.com'
				},
				suggested: {
					type: 'link:facebook',
					url: 'google.com'
				},
				note: 'test'
			});
		});
	});

	describe('#createPlaceTag', () => {
		it('should call stApi with correct args', async () => {
			await Dao.createPlaceTag('poi:530', 'test tag key', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place.tag:create',
				place_id: 'poi:530',
				suggested: {
					key: 'test tag key'
				},
				note: 'test'
			});
		});
	});

	describe('#deletePlaceTag', () => {
		it('should call stApi with correct args', async () => {
			await Dao.deletePlaceTag('poi:530', 'test tag key', 'test');
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place.tag:delete',
				place_id: 'poi:530',
				suggested: {
					key: 'test tag key'
				},
				note: 'test'
			});
		});
	});

	describe('#createPlaceMedia', () => {
		it('should call stApi with correct args', async () => {

			apiStub = sandbox.stub(StApi, 'postMultipartJsonImage').returns(
				new Promise<ApiResponse>((resolve) => {
					resolve(new ApiResponse(200, {
						place_id: 'poi:530'
					}));
			}));

			await Dao.createPlaceMedia(
				'poi:530',
				'some data',
				'png',
				License.CC_BY_SA_3,
				'test'
				);
			chai.expect(apiStub.getCall(0).args[0]).to.deep.equal('crowdsourcing/media');
			chai.expect(apiStub.getCall(0).args[1]).to.deep.equal({
				type: 'place.media:create',
				place_id: 'poi:530',
				original: null,
				suggested: {
					type: 'photo',
					license: 'cc_by_sa_3',
				},
				note: 'test'
			});
			chai.expect(apiStub.getCall(0).args[2]).to.deep.equal('png');
			chai.expect(apiStub.getCall(0).args[3]).to.deep.equal('some data');
		});
	});
});
