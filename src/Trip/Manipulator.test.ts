import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { Place } from '../Places';
import * as PlaceExpectedResults from '../TestData/PlacesExpectedResults';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Manipulator from './Manipulator';
import { Day, ItineraryItem, TransportSettings, Trip } from './Trip';

describe('TripManipulator', () => {

	const buildTestItem = (id: string): ItineraryItem => {
		const newPlace = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		const itineratyItem: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
		newPlace.id = id;
		itineratyItem.placeId = id;
		itineratyItem.place = newPlace;
		return itineratyItem;

	};

	describe('#addDay', () => {
		it('should add day to trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn =  '2017-04-11';

			if (expectedTrip.days) {
				expectedTrip.days.push({
					itinerary: [],
					note: null,
					date: '2017-04-11'
				} as Day);
			}

			return chai.expect(Manipulator.addDay(inputTrip)).to.deep.equal(expectedTrip);
		});
	});

	describe('#prependDayToTrip', () => {
		it('should add day to the beginning of trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.startsOn =  '2017-04-07';

			if (expectedTrip.days) {
				expectedTrip.days.unshift({
					itinerary: [],
					note: null,
					date: '2017-04-07'
				} as Day);
			}

			return chai.expect(Manipulator.prependDayToTrip(inputTrip)).to.deep.equal(expectedTrip);
		});
	});

	describe('#removeDayFromTrip', () => {
		it('should throw an error when invalid index is passed', () => {
			const indexToBeRemoved = 999;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should remove day from middle of days array and should change end date', () => {
			const indexToBeRemoved = 1;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.splice(indexToBeRemoved, 1);
				expectedTrip.days[expectedTrip.days.length - 1].date = '2017-04-09';
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});

		it('should remove day from beginning of days array and should change start date', () => {
			const indexToBeRemoved = 0;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.startsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.splice(indexToBeRemoved, 1);
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});

		it('should remove day from end of days array and should change end date', () => {
			const indexToBeRemoved = 2;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.pop();
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved)).to.deep.equal(expectedTrip);
		});
	});

	describe('#swapDaysInTrip', () => {
		it('should throw an error when invalid firstDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.swapDaysInTrip(inputTrip, 999, 1)).to.throw(Error, 'Invalid firstDayIndex');
		});

		it('should throw an error when invalid secondDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.swapDaysInTrip(inputTrip, 0, 999)).to.throw(Error, 'Invalid secondDayIndex');
		});

		it('should swap two days', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const tempDay = expectedTrip.days[0];
				expectedTrip.days[0] = expectedTrip.days[1];
				expectedTrip.days[1] = tempDay;
			}

			return chai.expect(Manipulator.swapDaysInTrip(inputTrip, 0, 1)).to.deep.equal(expectedTrip);
		});
	});

	describe('#movePlaceInDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 999, 0, 1))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionFrom is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 0, 999, 1))
				.to.throw(Error, 'Invalid positionFrom');
		});

		it('should throw an error when invalid positionTo is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 0, 0, 999))
				.to.throw(Error, 'Invalid positionTo');
		});

		it('should move place in a day when positionFrom is smaller than positionTo', () => {
			const positionFrom: number = 1;
			const positionTo: number = 3;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days = [inputTrip.days[0]];
				inputTrip.days[0].itinerary[0] = buildTestItem('poi:1');
				inputTrip.days[0].itinerary[1] = buildTestItem('poi:2');
				inputTrip.days[0].itinerary[2] = buildTestItem('poi:3');
				inputTrip.days[0].itinerary[3] = buildTestItem('poi:4');
			}

			if (expectedTrip.days) {
				expectedTrip.days = [expectedTrip.days[0]];
				expectedTrip.days[0].itinerary[0] = buildTestItem('poi:1');
				expectedTrip.days[0].itinerary[1] = buildTestItem('poi:3');
				expectedTrip.days[0].itinerary[2] = buildTestItem('poi:4');
				expectedTrip.days[0].itinerary[3] = buildTestItem('poi:2');
			}

			return chai.expect(Manipulator.movePlaceInDay(inputTrip, 0, positionFrom, positionTo))
				.to.deep.equal(expectedTrip);
		});

		it('should move place in a day when positionTo is smaller than positionFrom', () => {
			const positionFrom: number = 3;
			const positionTo: number = 1;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days = [inputTrip.days[0]];
				inputTrip.days[0].itinerary[0] = buildTestItem('poi:1');
				inputTrip.days[0].itinerary[1] = buildTestItem('poi:2');
				inputTrip.days[0].itinerary[2] = buildTestItem('poi:3');
				inputTrip.days[0].itinerary[3] = buildTestItem('poi:4');
			}

			if (expectedTrip.days) {
				expectedTrip.days = [expectedTrip.days[0]];
				expectedTrip.days[0].itinerary[0] = buildTestItem('poi:1');
				expectedTrip.days[0].itinerary[1] = buildTestItem('poi:4');
				expectedTrip.days[0].itinerary[2] = buildTestItem('poi:2');
				expectedTrip.days[0].itinerary[3] = buildTestItem('poi:3');
			}

			return chai.expect(Manipulator.movePlaceInDay(inputTrip, 0, positionFrom, positionTo))
				.to.deep.equal(expectedTrip);
		});
	});

	describe('#removePlaceFromDay', () => {
		it('should throw error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removePlaceFromDay(inputTrip, 999, 0))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw error when invalid positionInDay is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removePlaceFromDay(inputTrip, 0, 99))
				.to.throw(Error, 'Invalid positionInDay');
		});

		it('should remove place/itineraryItem from a day', () => {
			const positionInDay = 0;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.splice(positionInDay, 1);
			}

			const result = Manipulator.removePlaceFromDay(inputTrip, 0, positionInDay);
			return chai.expect(result).to.deep.equal(expectedTrip);
		});
	});

	describe('#addPlaceToDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipulator.addPlaceToDay(inputTrip, inputPlace, 999))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionInDay set', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipulator.addPlaceToDay(inputTrip, inputPlace, 0, 999))
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

			return chai.expect(Manipulator.addPlaceToDay(inputTrip, inputPlace, 0)).to.deep.equal(expectedTrip);
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

			return chai.expect(Manipulator.addPlaceToDay(inputTrip, inputPlace, 0, positionInDay))
				.to.deep.equal(expectedTrip);
		});
	});

	describe('#setTransport', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			return chai.expect(() => Manipulator.setTransport(inputTrip, 100, 999, null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid itemIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			return chai.expect(() => Manipulator.setTransport(inputTrip, 0, 999, null))
				.to.throw(Error, 'Invalid itemIndex');
		});

		it('should immutably set correct transport', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const transportSettings: TransportSettings = {
				mode: 'car',
				type: 'fastest',
				avoid: ['tolls'],
				startTime: 7200,
				duration: 3600,
				note: 'Run Forest Run',
				waypoints: [{lat: 1, lng: 1}],
			};
			const resultTrip =  Manipulator.setTransport(inputTrip, 0, 1, transportSettings);
			chai.expect(
				resultTrip.days && resultTrip.days[0].itinerary[1].transportFromPrevious
			).to.deep.equal(transportSettings);
			chai.expect(
				inputTrip.days && inputTrip.days[0].itinerary[1].transportFromPrevious
			).to.be.null;

			const resultNulled =  Manipulator.setTransport(resultTrip, 0, 1, null);
			chai.expect(
				resultNulled.days && resultNulled.days[0].itinerary[1].transportFromPrevious
			).to.be.null;
		});

	});
});
