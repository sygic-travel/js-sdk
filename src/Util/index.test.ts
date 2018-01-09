import * as chai from 'chai';
import * as Util from '.';

describe('UtilController', () => {
	describe('#splitArrayToChunks', () => {
		it('should split array to chunks', () => {
			chai.expect(Util.splitArrayToChunks([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 3)).to.deep.equal([
				[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]
			]);
			chai.expect(Util.splitArrayToChunks([1, 2], 3)).to.deep.equal([
				[1, 2]
			]);
		});
	});

	describe('#flatten', () => {
		it('should flatten array 1 level deep', () => {
			chai.expect(Util.flatten([[1, 2], [3, 4], [5, 6, 7]])).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
		});
	});
});
