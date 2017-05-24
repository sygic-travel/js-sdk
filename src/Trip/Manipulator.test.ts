import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
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

	const emptyDay: Day = {
		itinerary: [],
		note: null
	};

	describe('#addDay', () => {
		it('should add day to trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
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

	describe('#addDayToBeggining', () => {
		it('should add day to the beginning of trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.startsOn =  '2017-04-07';

			if (expectedTrip.days) {
				expectedTrip.days.unshift({
					itinerary: [],
					note: null
				} as Day);
			}

			return chai.expect(Manipuator.addDayToBeginning(inputTrip)).to.deep.equal(expectedTrip);
		});
	});

	describe('#removeDay', () => {
		it('should throw an error when invalid index is passed', () => {
			const indexToBeRemoved = 999;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.removeDay(inputTrip, indexToBeRemoved)).to.throw(Error, 'Invalid dayIndex');
		});

		it('should remove day from middle of days array and should not change dates', () => {
			const indexToBeRemoved = 1;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days.push(emptyDay);
				inputTrip.days.push(emptyDay);
			}

			if (expectedTrip.days) {
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.splice(indexToBeRemoved, 1);
			}

			return chai.expect(Manipuator.removeDay(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});

		it('should remove day from beginning of days array and should change start date', () => {
			const indexToBeRemoved = 0;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.startsOn = '2017-04-09';

			if (inputTrip.days) {
				inputTrip.days.push(emptyDay);
				inputTrip.days.push(emptyDay);
			}

			if (expectedTrip.days) {
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.splice(indexToBeRemoved, 1);
			}

			return chai.expect(Manipuator.removeDay(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});

		it('should remove day from end of days array and should change end date', () => {
			const indexToBeRemoved = 2;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn = '2017-04-09';

			if (inputTrip.days) {
				inputTrip.days.push(emptyDay);
				inputTrip.days.push(emptyDay);
			}

			if (expectedTrip.days) {
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.push(emptyDay);
				expectedTrip.days.splice(indexToBeRemoved, 1);
			}

			return chai.expect(Manipuator.removeDay(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});
	});

	describe('#swapDays', () => {
		it('should throw error an error when invalid firstDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.swapDays(inputTrip, 999, 1)).to.throw(Error, 'Invalid firstDayIndex');
		});

		it('should throw error an error when invalid secondDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.swapDays(inputTrip, 0, 999)).to.throw(Error, 'Invalid secondDayIndex');
		});

		it('should swap two days', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days.push(emptyDay);
			}

			if (expectedTrip.days) {
				expectedTrip.days.unshift(emptyDay);
			}

			return chai.expect(Manipuator.swapDays(inputTrip, 0, 1)).to.deep.equal(expectedTrip);
		});
	});
});
