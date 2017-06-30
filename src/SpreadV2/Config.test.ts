import * as chai from 'chai';
import { CategoriesCoefficients, getRatingCoeficientFromCategories, isDisabledByCategory } from './Config';

describe('Config', () => {

	const categoriesCoefficients: CategoriesCoefficients = {
		noCategory: 0.5,
		discovering: 0.8,
		eating: 0.5,
		goingOut: 0.5,
		hiking: 0.7,
		playing: 0.5,
		relaxing: 0.7,
		shopping: 0.5,
		sightseeing: 1,
		sleeping: 0.2,
		doingSports: 0.5,
		traveling: 0.1,
	};

	describe('#getRatingCoeficientFromCategories', () => {
		it('should select correct coefficient', () => {
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, [])).to.equal(0.5);
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, ['eating', 'hiking'])).to.equal(0.7);
			chai.expect(getRatingCoeficientFromCategories(categoriesCoefficients, ['doing_sports', 'sleeping'])).to.equal(0.5);
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
