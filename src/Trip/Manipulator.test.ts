import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';
import { cloneDeep } from '../Util';

import { Category, Place } from '../Places';
import * as PlaceExpectedResults from '../TestData/PlacesExpectedResults';
import * as TripExpectedResults from '../TestData/TripExpectedResults';
import * as Manipulator from './Manipulator';
import { Day, ItineraryItem, TransportAvoid, TransportMode, TransportSettings, Trip } from './Trip';

chai.use(dirtyChai);

describe('TripManipulator', () => {

	const buildTestItem = (id: string): ItineraryItem => {
		const newPlace = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
		const itineratyItem: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
		newPlace.id = id;
		itineratyItem.placeId = id;
		itineratyItem.place = newPlace;
		itineratyItem.isSticky = false;
		return itineratyItem;

	};

	describe('#appendDay', () => {
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

			return chai.expect(Manipulator.appendDay(inputTrip, null)).to.deep.equal(expectedTrip);
		});

		it('should add day to trip and add sticky place by default to new day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (inputTrip.days) {
				inputTrip.days = [inputTrip.days[0]];
				const place = inputTrip.days[0].itinerary[1].place;
				if (place) {
					place.categories = [Category.SLEEPING];
				}
			}
			const returnedTrip = Manipulator.appendDay(inputTrip, null);

			return chai.expect(returnedTrip.days && returnedTrip.days[1].itinerary[0].placeId)
				.to.equal(inputTrip.days && inputTrip.days[0].itinerary[1].placeId);
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

			return chai.expect(Manipulator.prependDayToTrip(inputTrip, null)).to.deep.equal(expectedTrip);
		});
	});

	describe('#addDayToTrip', () => {
		it('should add empty day to the beginning of trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn =  '2017-04-11';

			if (expectedTrip.days) {
				expectedTrip.days.unshift({
					itinerary: [],
					note: null,
					date: '2017-04-08'
				} as Day);
				expectedTrip.days[1].date = '2017-04-09';
				expectedTrip.days[2].date = '2017-04-10';
				expectedTrip.days[3].date = '2017-04-11';
			}

			return chai.expect(Manipulator.addDayToTrip(inputTrip, 0, null)).to.deep.equal(expectedTrip);
		});

		it('should add day to trip and copy sticky places', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn =  '2017-04-11';

			if (expectedTrip.days) {
				expectedTrip.days.splice(1, 0, {
					itinerary: [],
					note: null,
					date: '2017-04-09'
				} as Day);
				const item: ItineraryItem = cloneDeep(expectedTrip.days[0].itinerary[1]);
				item.isStickyFirstInDay = true;
				expectedTrip.days[1].itinerary.push(item);
				expectedTrip.days[2].date = '2017-04-10';
				expectedTrip.days[3].date = '2017-04-11';
			}

			return chai.expect(Manipulator.addDayToTrip(inputTrip, 1, null)).to.deep.equal(expectedTrip);
		});
	});

	describe('#removeDayFromTrip', () => {
		it('should throw an error when invalid index is passed', () => {
			const indexToBeRemoved = 999;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved, null))
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
				expectedTrip.days[0].itinerary[1].isSticky = false;
				expectedTrip.days[0].itinerary[1].isStickyFirstInDay = false;
				expectedTrip.days[0].itinerary[1].isStickyLastInDay = false;
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved, null)).to.deep.equal(expectedTrip);
		});

		it('should remove day from beginning of days array and should change end date', () => {
			const indexToBeRemoved = 0;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.splice(indexToBeRemoved, 1);
				expectedTrip.days[0].date = '2017-04-08';
				expectedTrip.days[1].date = '2017-04-09';
				expectedTrip.days[0].itinerary[0].isSticky = false;
				expectedTrip.days[0].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[0].itinerary[0].isStickyLastInDay = false;
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved, null)).to.deep.equal(expectedTrip);
		});

		it('should remove day from end of days array and should change end date', () => {
			const indexToBeRemoved = 2;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.endsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.pop();
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved, null)).to.deep.equal(expectedTrip);
		});
	});

	describe('#swapDaysInTrip', () => {
		it('should throw an error when invalid firstDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.swapDaysInTrip(inputTrip, 999, 1, null))
				.to.throw(Error, 'Invalid firstDayIndex');
		});

		it('should throw an error when invalid secondDayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.swapDaysInTrip(inputTrip, 0, 999, null))
				.to.throw(Error, 'Invalid secondDayIndex');
		});

		it('should swap two days', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const tempDay = expectedTrip.days[0];
				expectedTrip.days[0] = expectedTrip.days[1];
				expectedTrip.days[1] = tempDay;
				expectedTrip.days[0].itinerary[0].isSticky = false;
				expectedTrip.days[0].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[0].itinerary[0].isStickyLastInDay = false;
				expectedTrip.days[0].date = '2017-04-08';
				expectedTrip.days[1].itinerary[1].isSticky = false;
				expectedTrip.days[1].itinerary[1].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[1].isStickyLastInDay = false;
				expectedTrip.days[1].date = '2017-04-09';
			}

			return chai.expect(Manipulator.swapDaysInTrip(inputTrip, 0, 1, null)).to.deep.equal(expectedTrip);
		});
	});

	describe('#movePlaceInDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 999, 0, 1, null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionFrom is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 0, 999, 1, null))
				.to.throw(Error, 'Invalid positionFrom');
		});

		it('should throw an error when invalid positionTo is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.movePlaceInDay(inputTrip, 0, 0, 999, null))
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

			return chai.expect(Manipulator.movePlaceInDay(inputTrip, 0, positionFrom, positionTo, null))
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

			return chai.expect(Manipulator.movePlaceInDay(inputTrip, 0, positionFrom, positionTo, null))
				.to.deep.equal(expectedTrip);
		});

		it('should correctly resolve stickyness when moving sticky place from the end of the day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = Manipulator.movePlaceInDay(inputTrip, 0, 0, 1, null);

			let firstDayItinerary: ItineraryItem[];
			let secondDayItinerary: ItineraryItem[];

			if (expectedTrip.days) {
				firstDayItinerary = expectedTrip.days[0].itinerary;
				secondDayItinerary = expectedTrip.days[1].itinerary;

				chai.expect(firstDayItinerary[0].placeId).to.be.eq('poi:2');
				chai.expect(firstDayItinerary[0].isSticky).to.be.false('Expect false');
				chai.expect(firstDayItinerary[1].placeId).to.be.eq('poi:1');
				chai.expect(firstDayItinerary[1].isSticky).to.be.false('Expect false');

				chai.expect(secondDayItinerary[0].placeId).to.be.eq('poi:2');
				chai.expect(secondDayItinerary[0].isSticky).to.be.false('Expect false');
				chai.expect(secondDayItinerary[1].placeId).to.be.eq('poi:3');
				chai.expect(secondDayItinerary[1].isSticky).to.be.false('Expect false');
			}
		});
	});

	describe('#removePlacesFromDay', () => {
		it('should throw error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removePlacesFromDay(inputTrip, 999, [0], null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw error when invalid positionInDay is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			return chai.expect(() => Manipulator.removePlacesFromDay(inputTrip, 0, [99], null))
				.to.throw(Error, 'Invalid positionInDay');
		});

		it('should remove single place/itineraryItem from a day', () => {
			const positionInDay = 0;
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.splice(positionInDay, 1);
			}

			const result = Manipulator.removePlacesFromDay(inputTrip, 0, [positionInDay], null);
			return chai.expect(result).to.deep.equal(expectedTrip);
		});

		it('should remove multiple places/itineraryItems from a day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary.splice(0, 2);
				expectedTrip.days[1].itinerary[0].isSticky = false;
				expectedTrip.days[1].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[0].isStickyLastInDay = false;
			}

			const result = Manipulator.removePlacesFromDay(inputTrip, 0, [0, 1], null);
			return chai.expect(result).to.deep.equal(expectedTrip);
		});
	});

	describe('#removeAllPlacesFromDay', () => {
		it('should remove all places from given day in trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary = [];
				expectedTrip.days[1].itinerary[0].isSticky = false;
				expectedTrip.days[1].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[0].isStickyLastInDay = false;
			}
			return chai.expect(Manipulator.removeAllPlacesFromDay(inputTrip, 0, null)).to.be.deep.equal(expectedTrip);
		});
	});

	describe('#addPlaceToDay', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipulator.addPlaceToDay(inputTrip, inputPlace, 999, null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid positionInDay set', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			return chai.expect(() => Manipulator.addPlaceToDay(inputTrip, inputPlace, 0, null, 999))
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
					transportFromPrevious: null,
					isSticky: false,
					isStickyFirstInDay: false,
					isStickyLastInDay: false
				} as ItineraryItem);
				expectedTrip.days[0].itinerary[1].isSticky = false;
				expectedTrip.days[0].itinerary[1].isStickyFirstInDay = false;
				expectedTrip.days[0].itinerary[1].isStickyLastInDay = false;
				expectedTrip.days[1].itinerary[0].isSticky = false;
				expectedTrip.days[1].itinerary[0].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[0].isStickyLastInDay = false;
			}

			return chai.expect(Manipulator.addPlaceToDay(inputTrip, inputPlace, 0, null)).to.deep.equal(expectedTrip);
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
					transportFromPrevious: null,
					isSticky: false,
					isStickyFirstInDay: false,
					isStickyLastInDay: false
				} as ItineraryItem);
			}

			return chai.expect(Manipulator.addPlaceToDay(inputTrip, inputPlace, 0, null, positionInDay))
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
				mode: TransportMode.CAR,
				avoid: [TransportAvoid.TOLLS],
				startTime: 7200,
				duration: 3600,
				routeId: '3600:7200',
				note: 'Run Forest Run',
				waypoints: [{
					placeId: 'abc',
					location: {
						lat: 1,
						lng: 1
					}
				}]
			};
			const resultTrip =  Manipulator.setTransport(inputTrip, 0, 1, transportSettings);
			chai.expect(
				resultTrip.days && resultTrip.days[0].itinerary[1].transportFromPrevious
			).to.deep.equal(transportSettings);
			chai.expect(
				inputTrip.days && inputTrip.days[0].itinerary[1].transportFromPrevious
			).to.be.null('Expect null');

			const resultNulled =  Manipulator.setTransport(resultTrip, 0, 1, null);
			chai.expect(
				resultNulled.days && resultNulled.days[0].itinerary[1].transportFromPrevious
			).to.be.null('Expect null');
		});

	});

	describe('#updateItineraryItemUserData', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			return chai.expect(() => Manipulator.updateItineraryItemUserData(inputTrip, 100, 999, null, null, null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should throw an error when invalid itemIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			return chai.expect(() => Manipulator.updateItineraryItemUserData(inputTrip, 0, 999, null, null, null))
				.to.throw(Error, 'Invalid itemIndex');
		});

		it('should immutably set correct usr data', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const resultTrip =  Manipulator.updateItineraryItemUserData(inputTrip, 0, 1, 1000, 2000, 'test');
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[1].startTime).to.equal(1000);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[1].duration).to.equal(2000);
			chai.expect(resultTrip.days && resultTrip.days[0].itinerary[1].note).to.equal('test');

			const resultNulled =  Manipulator.updateItineraryItemUserData(resultTrip, 0, 1, null, null, null);
			chai.expect(resultNulled.days && resultNulled.days[0].itinerary[1].startTime).to.be.null('Expect null');
			chai.expect(resultNulled.days && resultNulled.days[0].itinerary[1].duration).to.be.null('Expect null');
			chai.expect(resultNulled.days && resultNulled.days[0].itinerary[1].note).to.be.null('Expect null');
		});

	});

	describe('#duplicateItineraryItem', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			chai.expect(() => Manipulator.duplicateItineraryItem(inputTrip, 100, 0, false, null))
				.to.throw(Error, 'Invalid dayIndex');
		});
		it('should throw an error when invalid itemIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			chai.expect(() => Manipulator.duplicateItineraryItem(inputTrip, 0, 1000, false, null))
				.to.throw(Error, 'Invalid itemIndex');
		});
		it('should duplicate place correctly', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days![0].itinerary[1].transportFromPrevious = cloneDeep(TripExpectedResults.transportSettings);
			const trip = Manipulator.duplicateItineraryItem(inputTrip, 0, 1, false, null);
			chai.expect(trip.days![0].itinerary[1].placeId).to.equal(trip.days![0].itinerary[2].placeId);
		});
		it('should duplicate place and reset transport correctly', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days![0].itinerary[1].transportFromPrevious = cloneDeep(TripExpectedResults.transportSettings);
			const trip = Manipulator.duplicateItineraryItem(inputTrip, 0, 1, true, null);
			chai.expect(trip.days![0].itinerary[1].placeId).to.equal(trip.days![0].itinerary[2].placeId);
			chai.expect(trip.days![0].itinerary[1].transportFromPrevious).to.deep.equal(TripExpectedResults.transportSettings);
			chai.expect(trip.days![0].itinerary[2].transportFromPrevious).to.be.null('Expected null');
		});
	});

	describe('#addOrReplaceOvernightPlace', () => {
		it('should throw an error when invalid dayIndex is passed', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);

			chai.expect(() => Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 999, null))
				.to.throw(Error, 'Invalid dayIndex');
		});

		it('should correctly replace current sticky place', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			inputTrip.days![1].itinerary[1].transportFromPrevious = null;
			expectedTrip.days![1].itinerary[1].transportFromPrevious = null;

			const item1: ItineraryItem = {
				place: inputPlace,
				placeId: 'poi:530',
				startTime: null,
				duration: null,
				note: null,
				transportFromPrevious: null,
				isSticky: true,
				isStickyFirstInDay: false,
				isStickyLastInDay: true
			};

			const item2: ItineraryItem = cloneDeep(item1);
			item2.isStickyFirstInDay = true;
			item2.isStickyLastInDay = false;

			expectedTrip.days![0].itinerary[1] = item1;
			expectedTrip.days![1].itinerary[0] = item2;

			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 0, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});

		it('should correctly add place to end of day and beginning of next day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const item1: ItineraryItem = {
					place: inputPlace,
					placeId: 'poi:530',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true,
					isStickyFirstInDay: false,
					isStickyLastInDay: true
				};

				const item2: ItineraryItem = cloneDeep(item1);
				item2.isStickyFirstInDay = true;
				item2.isStickyLastInDay = false;

				expectedTrip.days[1].itinerary.push(item1);
				expectedTrip.days[2].itinerary.unshift(item2);
			}
			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 1, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});

		it('should add place to end of day and beginning of next day and avoid duplicates in next day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			inputPlace.id = 'poi:4';
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const item: ItineraryItem = {
					place: inputPlace,
					placeId: 'poi:4',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true,
					isStickyFirstInDay: false,
					isStickyLastInDay: true
				};
				expectedTrip.days[1].itinerary.push(item);
				expectedTrip.days[2].itinerary[0].isSticky = true;
				expectedTrip.days[2].itinerary[0].isStickyFirstInDay = true;
				expectedTrip.days[2].itinerary[0].isStickyLastInDay = false;
			}
			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 1, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});

		it('should add place to end of day and beginning of next day and avoid duplicates in current day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			inputPlace.id = 'poi:3';
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const item: ItineraryItem = {
					place: inputPlace,
					placeId: 'poi:3',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true,
					isStickyFirstInDay: true,
					isStickyLastInDay: false
				};
				expectedTrip.days[2].itinerary.unshift(item);
				expectedTrip.days[1].itinerary[1].isSticky = true;
				expectedTrip.days[1].itinerary[1].isStickyFirstInDay = false;
				expectedTrip.days[1].itinerary[1].isStickyLastInDay = true;
			}
			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 1, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});

		it('should replace place and keep transport settings', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			inputPlace.id = 'poi:89765';
			const transportSettings: TransportSettings = {
				mode: TransportMode.PEDESTRIAN,
				avoid: [],
				startTime: 1000,
				duration: 3000,
				note: 'x',
				waypoints: [],
				routeId: 'x'
			};

			inputTrip.days![0].itinerary[1].transportFromPrevious = cloneDeep(transportSettings) as TransportSettings;
			expectedTrip.days![0].itinerary[1].transportFromPrevious = cloneDeep(transportSettings) as TransportSettings;

			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 0, null);
			chai.expect(trip.days![0].itinerary[1].placeId).to.be.eq('poi:89765');
			chai.expect(
				trip.days![0].itinerary[1].transportFromPrevious
			).to.deep.eq(
				expectedTrip.days[0].itinerary[1].transportFromPrevious
			);
		});
	});

	describe('#removePlaceFromDayByPlaceId', () => {
		it('should remove places from day by place id', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const resultTrip: Trip = Manipulator.removePlaceFromDayByPlaceId(inputTrip, 'poi:2', 0, null);
			const day: Day = resultTrip.days![0];
			chai.expect(day.itinerary.length).to.be.equal(1);
			chai.expect(day.itinerary[0].placeId).to.be.equal('poi:1');
		});
	});

	describe('#removePlacesFromDaysByPlaceId', () => {
		it('should remove places from days by place id', async () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const resultTrip: Trip = Manipulator.removePlaceFromDaysByPlaceId(inputTrip, 'poi:2', [0, 1], null);
			const day1: Day = resultTrip.days![0];
			const day2: Day = resultTrip.days![1];

			chai.expect(day1.itinerary.length).to.be.equal(1);
			chai.expect(day1.itinerary[0].placeId).to.be.equal('poi:1');

			chai.expect(day2.itinerary.length).to.be.equal(1);
			chai.expect(day2.itinerary[0].placeId).to.be.equal('poi:3');
		});
	});

	describe('#setStartDate', () => {
		it('should corectly set date and alter end date and days dates', async () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const resultTrip: Trip = Manipulator.setStartDate(inputTrip, '2018-10-11');
			chai.expect(resultTrip.startsOn).to.be.equal('2018-10-11');
			chai.expect(resultTrip.endsOn).to.be.equal('2018-10-13');
			chai.expect(resultTrip.days[0].date).to.be.equal('2018-10-11');
			chai.expect(resultTrip.days[1].date).to.be.equal('2018-10-12');
			chai.expect(resultTrip.days[2].date).to.be.equal('2018-10-13');
		});
	});
});
