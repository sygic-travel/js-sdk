import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import { setEnvironment } from '../Settings';
import * as Xhr from '../Xhr';
import { ApiResponse } from '../Xhr/ApiResponse';
import { getPlaces } from './Controller';
import { PlacesFilter, PlacesFilterJSON } from './Filter';

chai.use(chaiAsPromised);

describe('PlacesController', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	describe('#getPlaces', () => {
		it('should throw and exception when response without places came', (done) => {
			sinon.stub(Xhr, 'get').returns(new Promise<ApiResponse>((resolve) => {
				resolve(new ApiResponse('200', 200, '', {}));
			}));

			const placesFilterJSON: PlacesFilterJSON = {
				categories: ['eating'],
				level: null,
				limit: 20,
				mapSpread: null,
				mapTile: null,
				parent: 'city:1',
				query: null,
				tags: []
			};

			chai.expect(getPlaces(new PlacesFilter(placesFilterJSON))).to.be.rejected;

			done();
		});
	});
});
