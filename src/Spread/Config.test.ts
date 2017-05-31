import * as chai from 'chai';
import { getConfig } from './Config';

describe('Config', () => {

	describe('#getConfig', () => {
		it('should return spread configuration with correct minimalRating', () => {
			const bounds = {
				south: 51.45999681055091,
				west: -0.2542304992675782,
				north: 51.554661023239,
				east: -0.00102996826171
			};

			const canvas = {
				width: 100,
				height: 50,
			};

			let config = getConfig(bounds, canvas);
			chai.expect(config.length).to.equal(4);
			chai.expect(config[0].minimalRating).to.equal(0.3);
			chai.expect(config[1].minimalRating).to.equal(0.001);
			chai.expect(config[2].minimalRating).to.equal(0.001);
			chai.expect(config[3].minimalRating).to.equal(0.001);

			canvas.width = 1024;
			config = getConfig(bounds, canvas);
			chai.expect(config.length).to.equal(4);
			chai.expect(config[0].minimalRating).to.equal(0.3);
			chai.expect(config[1].minimalRating).to.equal(0);
			chai.expect(config[2].minimalRating).to.equal(0);
			chai.expect(config[3].minimalRating).to.equal(0);
		});
	});

});
