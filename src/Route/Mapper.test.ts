import * as chai from 'chai';

import { RouteRequest } from '.';
import { Location } from '../Geo';
import { route as apiRoute } from '../TestData/DirectionsApiResponses';
import { route as routeEntity } from '../TestData/DirectionsEntities';
import { ItineraryItem } from '../Trip';

import * as Mapper from './Mapper';

describe('RouteMapper', () => {

	describe('#mapRouteFromApiResponse', () => {

		it('should correctly map api response to response', () => {
			chai.expect(Mapper.mapRouteFromApiResponse(apiRoute, [], 'car', 'fastest'))
				.to.deep.equal(routeEntity);
		});

	});

	describe('#createRouteRequest', () => {

		it('should correctly create route request from user data', () => {
			const item: ItineraryItem = {
				placeId: 'poi:1',
				place: null,
				startTime: null,
				duration: null,
				note: null,
				isSticky: null,
				transportFromPrevious: {
					mode: 'car',
					type: 'economic',
					avoid: ['highways'],
					startTime: null,
					duration: null,
					note: null,
					waypoints: [{lat: 1, lng: 1 }],
				}
			};
			const origin: Location = {
				lat: 48.2,
				lng: 48.2
			};
			const destination: Location = {
				lat: 48.201,
				lng: 48.201
			};
			const expected: RouteRequest = {
				origin,
				destination,
				avoid: ['highways'],
				chosenMode: 'car',
				type: 'economic',
					waypoints: [{lat: 1, lng: 1 }],
			};
			chai.expect(Mapper.createRouteRequest(destination, origin, item))
				.to.deep.equal(expected);
		});

		it('should correctly create route request using defaults and estimates', () => {
			const item: ItineraryItem = {
				placeId: 'poi:1',
				place: null,
				startTime: null,
				duration: null,
				note: null,
				isSticky: null,
				transportFromPrevious: null
			};
			const origin: Location = {
				lat: 48.2,
				lng: 48.2
			};
			const destination: Location = {
				lat: 48.201,
				lng: 48.201
			};
			const expected: RouteRequest = {
				origin,
				destination,
				avoid: ['unpaved'],
				chosenMode: 'pedestrian',
				type: 'fastest',
				waypoints: [],
			};
			chai.expect(Mapper.createRouteRequest(destination, origin, item))
				.to.deep.equal(expected);
		});

	});

});
