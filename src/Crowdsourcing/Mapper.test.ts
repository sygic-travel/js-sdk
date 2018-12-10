import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { sandbox as sinonSandbox, SinonSandbox } from 'sinon';

import { License } from '../Media';
import { setEnvironment } from '../Settings';

import { Event, EventState, EventType } from './Event';
import { mapEventApiResponseToEvent } from './Mapper';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

const apiResponseEventBody: any = {
	id: 2,
	created_at: '2018-09-13 11:10:43',
	creator_id: '5b98b462ef115',
	creator_name: 'Jane Doe',
	creator_email: 'jane@doe.doe',
	moderated_at: '2018-09-13 11:10:43',
	moderated_state: 'accepted',
	processed_at: '2018-09-13 11:10:43'
};

const resultEventBody: any = {
	id: 2,
	createdAt: '2018-09-13 11:10:43',
	creatorId: '5b98b462ef115',
	creatorName: 'Jane Doe',
	creatorEmail: 'jane@doe.doe',
	moderatedAt: '2018-09-13 11:10:43',
	moderatedState: EventState.ACCEPTED,
	processedAt: '2018-09-13 11:10:43'
};

describe('CrowdsourcingDataAccess', () => {
	before((done) => {
		sandbox = sinonSandbox.create();
		setEnvironment({ stApiUrl: 'api', integratorApiKey: '987654321' });
		done();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#mapEventApiResponseToEvent', () => {
		it('should correctly map "place.media:create" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place.media:create',
					place_id: 'poi:530',
					original: null,
					suggested: {
						type: 'photo',
						license: 'cc_by_sa_3',
						placePhotoId: 1,
						location: {
							lat: 1,
							lng: 1
						}
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.CREATE_PLACE_MEDIA,
					placeId: 'poi:530',
					original: null,
					suggested: {
						type: 'photo',
						license: License.CC_BY_SA_3,
						placePhotoId: 1,
						location: {
							lat: 1,
							lng: 1
						}
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:address" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:address',
					place_id: 'poi:530',
					original: null,
					suggested: 'test address',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_ADDRESS,
					placeId: 'poi:530',
					original: null,
					suggested: 'test address',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:address" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:address',
					place_id: 'poi:530',
					original: 'test address',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_ADDRESS,
					placeId: 'poi:530',
					original: 'test address',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:admission" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:admission',
					place_id: 'poi:530',
					original: null,
					suggested: 'test admission',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_ADMISSION,
					placeId: 'poi:530',
					original: null,
					suggested: 'test admission',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:admission" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:admission',
					place_id: 'poi:530',
					original: 'test admission',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_ADMISSION,
					placeId: 'poi:530',
					original: 'test admission',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:email" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:email',
					place_id: 'poi:530',
					original: null,
					suggested: 'test@test.com',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_EMAIL,
					placeId: 'poi:530',
					original: null,
					suggested: 'test@test.com',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:email" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:email',
					place_id: 'poi:530',
					original: 'test@test.com',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_EMAIL,
					placeId: 'poi:530',
					original: 'test@test.com',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:location" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
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
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_LOCATION,
					placeId: 'poi:530',
					original: {
						lat: 1,
						lng: 1
					},
					suggested: {
						lat: 2,
						lng: 2
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:name" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:name',
					place_id: 'poi:530',
					language_id: 'en',
					original: 'original name',
					suggested: 'suggested name',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_NAME,
					placeId: 'poi:530',
					languageId: 'en',
					original: 'original name',
					suggested: 'suggested name',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:name" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:name',
					place_id: 'poi:530',
					language_id: 'en',
					original: 'original name',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_NAME,
					placeId: 'poi:530',
					languageId: 'en',
					original: 'original name',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:opening_hours" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:opening_hours',
					place_id: 'poi:530',
					original: null,
					suggested: 'some opening hours string',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_OPENING_HOURS,
					placeId: 'poi:530',
					original: null,
					suggested: 'some opening hours string',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:opening_hours" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:opening_hours',
					place_id: 'poi:530',
					original: 'some opening hours string',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_OPENING_HOURS,
					placeId: 'poi:530',
					original: 'some opening hours string',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:opening_hours_note" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:opening_hours_note',
					place_id: 'poi:530',
					original: null,
					suggested: 'some opening hours note string',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_OPENING_HOURS_NOTE,
					placeId: 'poi:530',
					original: null,
					suggested: 'some opening hours note string',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:opening_hours_note" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:opening_hours_note',
					place_id: 'poi:530',
					original: 'some opening hours note string',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_OPENING_HOURS_NOTE,
					placeId: 'poi:530',
					original: 'some opening hours note string',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:phone" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:phone',
					place_id: 'poi:530',
					original: null,
					suggested: '1234567890',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_PHONE,
					placeId: 'poi:530',
					original: null,
					suggested: '1234567890',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:phone" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:phone',
					place_id: 'poi:530',
					original: '1234567890',
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_PHONE,
					placeId: 'poi:530',
					original: '1234567890',
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:references" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:references',
					place_id: 'poi:530',
					language_id: 'en',
					original: {
						url: 'some url'
					},
					suggested: {
						type: 'link:official',
						url: 'some new url'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_REFERENCES,
					placeId: 'poi:530',
					languageId: 'en',
					original: {
						url: 'some url'
					},
					suggested: {
						type: 'link:official',
						url: 'some new url'
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:references" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:references',
					place_id: 'poi:530',
					language_id: 'en',
					original: {
						type: 'link:official',
						url: 'some url'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_REFERENCES,
					placeId: 'poi:530',
					languageId: 'en',
					original: {
						type: 'link:official',
						url: 'some url'
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:update:attributes" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:update:attributes',
					place_id: 'poi:530',
					language_id: 'en',
					original: {
						value: 'Gaudi'
					},
					suggested: {
						key: 'info:architect',
						value: 'Gehry'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.UPDATE_PLACE_ATTRIBUTES,
					placeId: 'poi:530',
					languageId: 'en',
					original: {
						value: 'Gaudi'
					},
					suggested: {
						key: 'info:architect',
						value: 'Gehry'
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place:delete:attributes" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place:delete:attributes',
					place_id: 'poi:530',
					language_id: 'en',
					original: {
						key: 'info:architect',
						value: 'Gaudi'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_ATTRIBUTES,
					placeId: 'poi:530',
					languageId: 'en',
					original: {
						key: 'info:architect',
						value: 'Gaudi'
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place.tag:create" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place.tag:create',
					place_id: 'poi:530',
					suggested: {
						key: 'some tag'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.CREATE_PLACE_TAG,
					placeId: 'poi:530',
					suggested: {
						key: 'some tag'
					},
					note: 'test'
				}
			} as Event);
		});

		it('should correctly map "place.tag:delete" event type', async () => {
			chai.expect(mapEventApiResponseToEvent({
				...apiResponseEventBody,
				data: {
					type: 'place.tag:delete',
					place_id: 'poi:530',
					suggested: {
						key: 'some tag'
					},
					note: 'test'
				}
			})).to.deep.equal({
				...resultEventBody,
				data: {
					type: EventType.DELETE_PLACE_TAG,
					placeId: 'poi:530',
					suggested: {
						key: 'some tag'
					},
					note: 'test'
				}
			} as Event);
		});
	});
});
