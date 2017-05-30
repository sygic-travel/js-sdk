import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';

import { setEnvironment } from '../Settings';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Manipuator from './Manipulator';
import { Day, Trip } from './Trip';

let sandbox: SinonSandbox;
chai.use(chaiAsPromised);

describe('TripManipulator', () => {
	before((done) => {
		setEnvironment('api', '987654321');
		done();
	});

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('#addDay', () => {
		it('should add day to trip', () => {
			const inputTrip: Trip = Object.assign({}, TripExpectedResults.tripDetailed);
			inputTrip.id = '111';

			const expectedTrip: Trip = Object.assign({}, TripExpectedResults.tripDetailed);
			expectedTrip.id = '111';
			expectedTrip.endsOn =  '2017-04-11';

			if (expectedTrip.days) {
				expectedTrip.days.push({
					itinerary: [],
					note: null
				} as Day);
			}

			return chai.expect(Manipuator.addDay(inputTrip)).to.deep.equal(expectedTrip);
		});
	});
});
