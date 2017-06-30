import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import { getPlaces } from '.';
import { PlacesFilter } from '../Places/Filter';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';

let sandbox;

chai.use(chaiAsPromised);

describe('Api', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#getPlaces', () => {
		it('should call per tiles when map spread is required', (done) => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse(200, { places: [] }));
			}));
			const filter = new PlacesFilter({
				bounds: {
					south: 0,
					west: 0,
					north: 1,
					east: 1
				},
				mapSpread: 1,
				zoom: 10
			});

			const result = getPlaces(filter);
			chai.expect(result).to.eventually.have.property('data').to.be.deep.equal({places: []});
			chai.expect(stub.callCount).to.be.equal(1);
			chai.expect(stub.args[0][0]).to.be.equal(
				'places/list?map_tiles=1222222212%7C1222222203%7C1222222202%7C1222222230%7' +
				'C1222222221%7C1222222220%7C1222222232%7C1222222223%7C1222222222%7C3000000010%7C' +
				'3000000001%7C3000000000&map_spread=1&limit=32'
			);
			done();
		});
	});
});
