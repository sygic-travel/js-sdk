import * as chai from 'chai';

import { TransportMode } from '../Trip';
import * as Selector from './ModeSelector';

describe('ModeSelector', () => {

	describe('#selectOptimalMode', () => {

		it('should correctly select optimal mode', () => {
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 49.2, lng: 49.2}))
				.to.equal(TransportMode.CAR);
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 48.2, lng: 48.21}))
				.to.equal(TransportMode.PEDESTRIAN);
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 60.2, lng: 5.2}))
				.to.equal(TransportMode.PLANE);
		});

	});
});
