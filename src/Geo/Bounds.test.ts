import * as chai from 'chai';
import { getZoomFromBounds } from './Bounds';

describe('Bounds', () => {

	describe('#getZoomFromBounds', () => {
		it('should return correct zoom', () => {
			const bounds = {
				south: 51.45999681055091,
				west: -0.2542304992675782,
				north: 51.554661023239,
				east: -0.00102996826171
			};

			chai.expect(getZoomFromBounds(bounds, 1024)).to.equal(12);
			chai.expect(getZoomFromBounds(bounds, 512)).to.equal(11);
			chai.expect(getZoomFromBounds(bounds, 4100)).to.equal(14);
		});
	});

});
