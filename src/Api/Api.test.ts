import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import { getPlaces } from '.';
import { PlacesListFilter } from '../Places/ListFilter';
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
			const filter = new PlacesListFilter({
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
			chai.expect(stub.callCount).to.be.equal(12);
			done();
		});

		it('should not fail on api error', (done) => {
			const stub = sandbox.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve, reject) => {
				reject(new Error('Something went wrong'));
			}));
			const filter = new PlacesListFilter({
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
			chai.expect(stub.callCount).to.be.equal(12);
			done();
		});
	});
});
