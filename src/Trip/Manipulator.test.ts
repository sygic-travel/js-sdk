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
		itineratyItem.isSticky = false;
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

			return chai.expect(Manipulator.addDay(inputTrip, null)).to.deep.equal(expectedTrip);
		});

		it('should add day to trip and add sticky place by default to new day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (inputTrip.days) {
				inputTrip.days = [inputTrip.days[0]];
				const place = inputTrip.days[0].itinerary[1].place;
				if (place) {
					place.categories = ['sleeping'];
				}
			}
			const returnedTrip = Manipulator.addDay(inputTrip, null);

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

		it('should add day to trip and add sticky place by default to new day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			if (inputTrip.days) {
				inputTrip.days = [inputTrip.days[0]];
				const place = inputTrip.days[0].itinerary[0].place;
				if (place) {
					place.categories = ['sleeping'];
				}
			}
			const returnedTrip = Manipulator.prependDayToTrip(inputTrip, null);

			return chai.expect(returnedTrip.days && returnedTrip.days[0].itinerary[0].placeId)
				.to.equal(inputTrip.days && inputTrip.days[0].itinerary[0].placeId);
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
			}

			return chai.expect(Manipulator.removeDayFromTrip(inputTrip, indexToBeRemoved, null)).to.deep.equal(expectedTrip);
		});

		it('should remove day from beginning of days array and should change start date', () => {
			const indexToBeRemoved = 0;

			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			expectedTrip.startsOn = '2017-04-09';

			if (expectedTrip.days) {
				expectedTrip.days.splice(indexToBeRemoved, 1);
				expectedTrip.days[0].itinerary[0].isSticky = false;
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
				expectedTrip.days[1].itinerary[1].isSticky = false;
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
				chai.expect(firstDayItinerary[0].isSticky).to.be.false;
				chai.expect(firstDayItinerary[1].placeId).to.be.eq('poi:1');
				chai.expect(firstDayItinerary[1].isSticky).to.be.false;

				chai.expect(secondDayItinerary[0].placeId).to.be.eq('poi:2');
				chai.expect(secondDayItinerary[0].isSticky).to.be.false;
				chai.expect(secondDayItinerary[1].placeId).to.be.eq('poi:3');
				chai.expect(secondDayItinerary[1].isSticky).to.be.false;
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
					isSticky: false
				} as ItineraryItem);
				expectedTrip.days[0].itinerary[1].isSticky = false;
				expectedTrip.days[1].itinerary[0].isSticky = false;
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
					isSticky: false
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

			if (expectedTrip.days) {
				const item = {
					place: inputPlace,
					placeId: 'poi:530',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				};
				expectedTrip.days[0].itinerary[1] = item;
				expectedTrip.days[1].itinerary[0] = item;
			}
			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 0, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});

		it('should correctly add place to end of day and beginning of next day', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const inputPlace: Place = cloneDeep(PlaceExpectedResults.placeDetailedEiffelTowerWithoutMedia);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (expectedTrip.days) {
				const item = {
					place: inputPlace,
					placeId: 'poi:530',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				};
				expectedTrip.days[1].itinerary.push(item);
				expectedTrip.days[2].itinerary.unshift(item);
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
				const item = {
					place: inputPlace,
					placeId: 'poi:4',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				};
				expectedTrip.days[1].itinerary.push(item);
				expectedTrip.days[2].itinerary[0].isSticky = true;
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
				const item = {
					place: inputPlace,
					placeId: 'poi:3',
					startTime: null,
					duration: null,
					note: null,
					transportFromPrevious: null,
					isSticky: true
				};
				expectedTrip.days[2].itinerary.unshift(item);
				expectedTrip.days[1].itinerary[1].isSticky = true;
			}
			const trip = Manipulator.addOrReplaceOvernightPlace(inputTrip, inputPlace, 1, null);
			chai.expect(trip).to.deep.equal(expectedTrip);
		});
	});

	describe('#replaceClosestParentDestination', () => {
		it('should correctly replace destination when poi is added after destination', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days[0].itinerary[0].placeId = 'city:14';
				const place: Place | null = inputTrip.days[0].itinerary[0].place;
				if (place) {
					place.id = 'city:14';
					inputTrip.days[0].itinerary[0].place = place;
				}
			}

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary[0].placeId = 'poi:2';
				expectedTrip.days[0].itinerary[0].isSticky = true;
				const place: Place | null = expectedTrip.days[0].itinerary[0].place;
				if (place) {
					place.id = 'poi:2';
					expectedTrip.days[0].itinerary[0].place = place;
				}
				expectedTrip.days[0].itinerary.pop();
			}

			return chai.expect(Manipulator.replaceSiblingParentDestination(inputTrip, 0, 1, ['city:14'], null))
				.to.deep.equal(expectedTrip);
		});

		it('should correctly replace destination when poi is added before destination', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				inputTrip.days[0].itinerary[1].placeId = 'city:14';
				let place: Place | null = inputTrip.days[0].itinerary[1].place;
				if (place) {
					place.id = 'city:14';
					inputTrip.days[0].itinerary[1].place = place;
				}

				inputTrip.days[1].itinerary[0].placeId = 'city:14';
				place = inputTrip.days[1].itinerary[0].place;
				if (place) {
					place.id = 'city:14';
					inputTrip.days[1].itinerary[0].place = place;
				}
			}

			if (expectedTrip.days) {
				expectedTrip.days[0].itinerary[0].placeId = 'poi:1';
				let place: Place | null = expectedTrip.days[0].itinerary[0].place;
				if (place) {
					place.id = 'poi:1';
					expectedTrip.days[0].itinerary[0].place = place;
				}
				expectedTrip.days[0].itinerary.pop();

				// next day
				expectedTrip.days[1].itinerary[0].placeId = 'city:14';
				expectedTrip.days[1].itinerary[0].isSticky = false;
				place = expectedTrip.days[1].itinerary[0].place;
				if (place) {
					place.id = 'city:14';
					expectedTrip.days[1].itinerary[0].place = place;
				}
			}

			return chai.expect(Manipulator.replaceSiblingParentDestination(inputTrip, 0, 0, ['city:14'], null))
				.to.deep.equal(expectedTrip);
		});

		it('should correctly replace destination with poi when there are multiple destinations in trip', () => {
			const inputTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);
			const expectedTrip: Trip = cloneDeep(TripExpectedResults.tripDetailed);

			if (inputTrip.days) {
				const itineraryItem2: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				const itineraryItem3: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				const itineraryItem4: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				const itineraryItem5: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				itineraryItem2.placeId = 'poi:222';
				itineraryItem3.placeId = 'city:14';
				itineraryItem4.placeId = 'poi:333';
				itineraryItem5.placeId = 'city:14';
				if (itineraryItem2.place) {
					itineraryItem2.place.id = 'poi:222';
				}
				if (itineraryItem3.place) {
					itineraryItem3.place.id = 'city:14';
				}
				if (itineraryItem4.place) {
					itineraryItem4.place.id = 'poi:333';
				}
				if (itineraryItem5.place) {
					itineraryItem5.place.id = 'city:14';
				}
				inputTrip.days[0].itinerary.splice(1, 0, itineraryItem2);
				inputTrip.days[0].itinerary.splice(2, 0, itineraryItem3);
				inputTrip.days[0].itinerary.splice(3, 0, itineraryItem4);
				inputTrip.days[0].itinerary.splice(4, 0, itineraryItem5);
			}

			if (expectedTrip.days) {
				const itineraryItem2: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				const itineraryItem3: ItineraryItem = cloneDeep(TripExpectedResults.itineratyItem);
				itineraryItem2.placeId = 'poi:222';
				itineraryItem3.placeId = 'poi:333';
				if (itineraryItem2.place) {
					itineraryItem2.place.id = 'poi:222';
				}
				if (itineraryItem3.place) {
					itineraryItem3.place.id = 'poi:333';
				}
				expectedTrip.days[0].itinerary.splice(1, 0, itineraryItem2);
				expectedTrip.days[0].itinerary.splice(2, 0, itineraryItem3);
			}

			return chai.expect(Manipulator.replaceSiblingParentDestination(inputTrip, 0, 3, ['city:14'], null))
				.to.deep.equal(expectedTrip);
		});
	});
});
