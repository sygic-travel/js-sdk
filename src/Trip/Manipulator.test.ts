import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as cloneDeep from 'lodash.clonedeep';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';

import { Place } from '../Places';
import { setEnvironment } from '../Settings';
import * as PlaceExpectedResults from '../TestData/PlacesExpectedResults';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Manipuator from './Manipulator';
import { Day, ItineraryItem, Trip } from './Trip';

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
			return chai.expect(() => Manipuator.removeDay(inputTrip, indexToBeRemoved))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should remove day from middle of days array and should change end date', () => {
			const indexToBeRemoved = 1;
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
		it('should throw an error when invalid firstDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.swapDays(inputTrip, 999, 1)).to.throw(Error, 'Invalid firstDayIndex');
		});

		it('should throw an error when invalid secondDayIndex is passed', () => {
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

	describe('#movePlaceInDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.movePlaceInDay(inputTrip, 999, 0, 1))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionFrom is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.movePlaceInDay(inputTrip, 0, 999, 1))
				.to.throw(Error, 'Invalid positionFrom');
		});

		it('should throw an error when invalid positionTo is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.movePlaceInDay(inputTrip, 0, 0, 999))
				.to.throw(Error, 'Invalid positionTo');
		});

		it('should move place in a day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const firstItineraryItem: ItineraryItem = expectedTrip.days[0].itinerary[0];
				const secondItineraryItem: ItineraryItem = expectedTrip.days[0].itinerary[1];
				expectedTrip.days[0].itinerary[0] = secondItineraryItem;
				expectedTrip.days[0].itinerary[1] = firstItineraryItem;
			}

			return chai.expect(Manipuator.movePlaceInDay(inputTrip, 0, 0, 1)).to.deep.equal(expectedTrip);
		});
	});

	describe('#removePlaceInDay', () => {
		it('should throw error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.removePlaceInDay(inputTrip, 999, 0))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw error when invalid positionInDay is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipuator.removePlaceInDay(inputTrip, 0, 99))
				.to.throw(Error, 'Invalid positionInDay');
		});

		it('should remove place/itineraryItem from a day', () => {
			const positionInDay = 0;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.splice(positionInDay, 1);
			}

			const result = Manipuator.removePlaceInDay(inputTrip, 0, positionInDay);
			return chai.expect(result).to.deep.equal(expectedTrip);
		});
	});

	describe('#addPlaceToDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipuator.addPlaceToDay(inputTrip, inputPlace, 999))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionInDay set', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipuator.addPlaceToDay(inputTrip, inputPlace, 0, 999))
				.to.throw(Error, 'Invalid positionInDay');
		});

		it('should correctly add place to the end of the day when positionInDay is not set', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.push({
					place: inputPlace,
					placeId: 'poi:530',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem);
			}

			return chai.expect(Manipuator.addPlaceToDay(inputTrip, inputPlace, 0)).to.deep.equal(expectedTrip);
		});

		it('should correctly add place to to right position in day when positionInDay is set', () => {
			const positionInDay = 1;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.splice(positionInDay, 0, {
					place: inputPlace,
					placeId: 'poi:530',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null
				} as ItineraryItem);
			}

			return chai.expect(Manipuator.addPlaceToDay(inputTrip, inputPlace, 0, positionInDay))
				.to.deep.equal(expectedTrip);
		});
	});
});
