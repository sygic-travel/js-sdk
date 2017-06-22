import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { SinonSandbox } from 'sinon';
import * as sinon from 'sinon';

import { Location } from '../Geo';
import { setEnvironment } from '../Settings';
import * as TestApiExpectedResults from '../TestData/SearchLocationExpectedResults';
import * as TestApiResponses from '../TestData/SearchLocationsApiResponses';
import * as Xhr from '../Xhr';
import * as Dao from './DataAccess';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('SearchDataAccess', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	const query = 'eiffel tower';
	const location = {
		lat: 50.088762,
		lng: 14.421861
	} as Location;

	describe('#searchAddress', () => {
		it('should throw and exception when response without searched locations came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {}));
			}));

			return chai.expect(Dao.searchAddress(query, location)).to.be.rejected;
		});

		it('should correctly map searchAddress response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestApiResponses.locations));
			}));

			return chai.expect(Dao.searchAddress(query, location))
				.to.eventually.deep.equal(TestApiExpectedResults.locations);
		});
	});

	describe('#searchAddressReverse', () => {
		it('should throw and exception when response without searched locations came', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, {}));
			}));

			return chai.expect(Dao.searchAddressReverse(location)).to.be.rejected;
		});

		it('should correctly map searchAddress response', () => {
			sandbox.stub(Xhr, 'get').returns(new Promise<Xhr.ApiResponse>((resolve) => {
				resolve(new Xhr.ApiResponse(200, TestApiResponses.locations));
			}));

			return chai.expect(Dao.searchAddressReverse(location))
				.to.eventually.deep.equal(TestApiExpectedResults.locations);
		});
	});
});
