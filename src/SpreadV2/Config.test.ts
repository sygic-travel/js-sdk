import * as chai from 'chai';
import { CategoriesCoefficients, getRatingCoeficientFromCategories, isDisabledByCategory } from './Config';

describe('Config', () => {

	const categoriesCoefficients: CategoriesCoefficients = {
		noCategory: 0.3,
		discovering: 0.8,
		eating: 0.6,
		goingOut: 0.6,
		hiking: 0.5,
		playing: 0.5,
		relaxing: 0.6,
		shopping: 0.5,
		sightseeing: 1,
		sleeping: 0.2,
		doingSports: 0.4,
		traveling: 0.1,
	};

	describe('#getRatingCoeficientFromCategories', () => {
		it('should select correct coefficient', () => {
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, [])).to.equal(0.3);
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, ['eating', 'hiking'])).to.equal(0.6);
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, ['doing_sports', 'sleeping'])).to.equal(0.4);
		});
	});

	describe('#isDisabledByCategory', () => {
		it('should detect disabled size', () => {
			chai.expect(isDisabledByCategory(['no_category'], [])).to.be.true;
			chai.expect(isDisabledByCategory(['no_category'], ['eating'])).to.be.false;
			chai.expect(isDisabledByCategory(['going_out'], ['eating', 'going_out'])).to.be.false;
		});
	});

});
