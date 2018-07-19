import * as chai from 'chai';

import { RouteRequest } from '.';
import { Location } from '../Geo';
import { route as apiRoute } from '../TestData/DirectionsApiResponses';
import { route as routeEntity } from '../TestData/DirectionsEntities';
import { TransportAvoid, TransportMode } from '../Trip';
import { cloneDeep } from '../Util';

import * as Mapper from './Mapper';

describe('RouteMapper', () => {

	describe('#mapRouteFromApiResponse', () => {

		it('should correctly map api response to response', () => {
			const result = cloneDeep(routeEntity);
			delete result.chosenDirection;
			chai.expect(Mapper.mapRouteFromApiResponse(apiRoute, []))
				.to.deep.equal(result);
		});

	});

	describe('#createRouteRequest', () => {

		it('should correctly create route request from user data', () => {
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
				routeId: '30:50',
				avoid: [TransportAvoid.HIGHWAYS],
				chosenMode: TransportMode.CAR,
				waypoints: [{
					placeId: 'abc',
					location: {
						lat: 1,
						lng: 1
					}
				}],
				departAt: 'test',
				arriveAt: null
			};
			chai.expect(Mapper.createRouteRequest(
				destination,
				origin,
				'30:50',
				'test',
				[{
					placeId: 'abc',
					location: {
						lat: 1, lng: 1
					}
				}],
				[TransportAvoid.HIGHWAYS],
				TransportMode.CAR
			)).to.deep.equal(expected);
		});

		it('should correctly create route request using defaults and estimates', () => {
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
				routeId: null,
				avoid: [TransportAvoid.UNPAVED],
				chosenMode: null,
				waypoints: [],
				departAt: null,
				arriveAt: null
			};
			chai.expect(Mapper.createRouteRequest(destination, origin, null, null))
				.to.deep.equal(expected);
		});
	});

});
