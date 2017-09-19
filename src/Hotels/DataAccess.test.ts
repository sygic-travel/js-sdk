import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import * as HotelsApiData from '../TestData/HotelsApiReponses';
import * as HotelsResults from '../TestData/HotelsExpectedResults';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import * as Dao from './DataAccess';
import { HotelsFilter } from './Filter';

let sandbox: SinonSandbox;

describe('HotelsDataAccess', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getHotels', () => {
		it('should correctly call api and map hotels response', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(HotelsApiData.hotels)));
			}));

			const hotelsFilter: HotelsFilter = new HotelsFilter({
				adults: 2,
				checkIn: '2017-11-11',
				checkOut: '2017-11-12',
				placeIds: ['poi:1', 'poi:2']
			});

			chai.expect(await Dao.getHotels(hotelsFilter))
				.to.deep.equal(HotelsResults.availableHotels);
			chai.expect(apiStub.callCount).to.equal(1);
			chai.expect(apiStub.getCall(0).args[0])
				.to.equal('hotels/list/?adults=2&check_in=2017-11-11&check_out=2017-11-12&place_ids=poi%3A1%7Cpoi%3A2');
		});

		it('should use map tiles if bounds and zoom are passed', async () => {
			const apiStub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, cloneDeep(HotelsApiData.hotels)));
			}));

			const hotelsFilter: HotelsFilter = new HotelsFilter({
				adults: 2,
				checkIn: '2017-11-11',
				checkOut: '2017-11-12',
				bounds: {
					south: 1,
					west: 1,
					north: 2,
					east: 2
				},
				zoom: 3
			});
			await Dao.getHotels(hotelsFilter);
			chai.expect(apiStub.getCall(0).args[0])
				.to.equal('hotels/list/?adults=2&check_in=2017-11-11&check_out=2017-11-12&map_tile_bounds=122%2C122');
		});
	});
});
