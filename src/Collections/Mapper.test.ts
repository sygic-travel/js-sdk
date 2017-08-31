import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';

import * as ApiResponses from '../TestData/CollectionsApiResponses';
import * as ExpectedResults from '../TestData/CollectionsExpectedResults';
import * as Mapper from './Mapper';

chai.use(chaiAsPromised);

let sandbox;

describe('CollectionMapper', () => {
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#mapCollectionApiResponseToCollection', () => {
		it('should correctly map collection response to Collection', () => {
			return chai.expect(Mapper.mapCollectionApiResponseToCollection(ApiResponses.collection.collection))
				.to.deep.equal(ExpectedResults.collection);
		});
	});

	describe('#mapCollectionsApiResponseToCollections', () => {
		it('should correctly map collections response to Collections', () => {
			return chai.expect(Mapper.mapCollectionsApiResponseToCollections(ApiResponses.collections.collections))
				.to.deep.equal(ExpectedResults.collections);
		});
	});
});
