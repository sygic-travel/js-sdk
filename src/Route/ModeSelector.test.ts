import * as chai from 'chai';

import * as Selector from './ModeSelector';

describe('ModeSelector', () => {

	describe('#selectOptimalMode', () => {

		it('should correctly select optimal mode', () => {
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 49.2, lng: 49.2})).to.equal('car');
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 48.2, lng: 48.21})).to.equal('pedestrian');
			chai.expect(Selector.selectOptimalMode({lat: 48.2, lng: 48.2}, {lat: 60.2, lng: 5.2})).to.equal('plane');
		});

	});

	describe('#getAvailableModes', () => {
		it('should correctly select optimal mode', () => {
			chai.expect(
				Selector.getAvailableModes({lat: 48.2, lng: 48.2}, {lat: 49.2, lng: 49.2})
			).to.deep.equal(['car', 'plane']);
			chai.expect(
				Selector.getAvailableModes({lat: 48.2, lng: 48.2}, {lat: 48.2, lng: 48.21})
			).to.deep.equal(['pedestrian', 'car']);
			chai.expect(
				Selector.getAvailableModes({lat: 48.2, lng: 48.2}, {lat: 60.2, lng: 5.2})
			).to.deep.equal(['plane']);
		});

	});
});
