import * as chai from 'chai';
import { Direction } from '.';
import { Location } from '../Geo';

import * as Estimator from './Estimator';

describe('Estimator', () => {

	describe('#estimatePlaneDirection', () => {

		it('should correctly build place direction', () => {
			const origin: Location = {lat: 10, lng: 10};
			const destination: Location = {lat: 11, lng: 11};
			const direction: Direction = Estimator.estimatePlaneDirection(origin, destination);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.type).to.equal('fastest');
			chai.expect(direction.distance).to.equal(156116);
			chai.expect(direction.duration).to.equal(7824);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
		});

	});
});
