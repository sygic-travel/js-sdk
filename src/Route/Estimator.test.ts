import * as chai from 'chai';
import * as dirtyChai from 'dirty-chai';
import { Location } from '../Geo';
import { TransportMode } from '../Trip';

import * as Estimator from './Estimator';
import { Direction, ModeDirections } from './Route';

chai.use(dirtyChai);

const origin: Location = {lat: 10, lng: 10};
const destination: Location = {lat: 11, lng: 11};

describe('Estimator', () => {
	describe('#estimateDummyDirection', () => {
		it('should correctly build dummy direction', () => {
			const direction: Direction = Estimator.estimateDummyDirection(TransportMode.TRAIN, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.TRAIN);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.be.null('Expect null');
			chai.expect(direction.duration).to.be.null('Expect null');
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});
	});

	describe('#estimateCarDirection', () => {
		it('should correctly build car direction when distance is from 0 to 2 km', () => {
			const direction: Direction = Estimator.estimateCarDirection(1000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.CAR);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(1800);
			chai.expect(direction.duration).to.equal(133);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});

		it('should correctly build car direction when distance is from 2 to 6 km', () => {
			const direction: Direction = Estimator.estimateCarDirection(5000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.CAR);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(8000);
			chai.expect(direction.duration).to.equal(667);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});

		it('should correctly build car direction when distance is from more than 6 km', () => {
			const direction: Direction = Estimator.estimateCarDirection(30000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.CAR);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(36000);
			chai.expect(direction.duration).to.equal(2038);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});

		it('should correctly build car direction when distance is from more than 40 km', () => {
			const direction: Direction = Estimator.estimateCarDirection(50000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.CAR);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(60000);
			chai.expect(direction.duration).to.equal(2000);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});
	});

	describe('#estimatePedestrianDirection', () => {
		it('should correctly build pedestrian direction when distance is from 0 to 2 km', () => {
			const direction: Direction = Estimator.estimatePedestrianDirection(1000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.PEDESTRIAN);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(1350);
			chai.expect(direction.duration).to.equal(750);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});

		it('should correctly build pedestrian direction when distance is from 2 to 6 km', () => {
			const direction: Direction = Estimator.estimatePedestrianDirection(5000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.PEDESTRIAN);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(6100);
			chai.expect(direction.duration).to.equal(3750);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});

		it('should correctly build pedestrian direction when distance is from more than 6 km', () => {
			const direction: Direction = Estimator.estimatePedestrianDirection(7000, origin, destination);
			chai.expect(direction.mode).to.equal(TransportMode.PEDESTRIAN);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(7742);
			chai.expect(direction.duration).to.equal(5250);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});
	});

	describe('#estimatePlaneDirection', () => {
		it('should correctly build plane direction', () => {
			const direction: Direction = Estimator.estimatePlaneDirection(90000, origin, destination);
			chai.expect(direction.polyline).to.equal('_c`|@_c`|@_ibE_ibE');
			chai.expect(direction.distance).to.equal(90000);
			chai.expect(direction.duration).to.equal(2760);
			chai.expect(direction.avoid).to.deep.equal([]);
			chai.expect(direction.isoCodes).to.deep.equal([]);
			chai.expect(direction.source).to.equal('estimator');
			chai.expect(direction.routeId).to.be.null('Expect null');
		});
	});

	describe('#estimateMissingDirections', () => {
		it('should estimate and build missing car, pedestrian, bike, plane, bus, train, boat directions', () => {
			const inputModeDirections: ModeDirections[] = [{
				mode: TransportMode.CAR,
				directions: [{
					distance: null,
					duration: null,
					polyline: '',
					mode: TransportMode.CAR,
					avoid: [],
					source: 'estimator',
					isoCodes: [],
					routeId: null
				}]
			}];
			const modeDirections: ModeDirections[] = Estimator.estimateModeDirections(
				inputModeDirections,
				origin,
				destination
			);
			chai.expect(modeDirections.length).to.equal(6);
			const modeDirectionThatShouldntBeThere = modeDirections.find((modeDirection: ModeDirections) =>
				modeDirection.mode === TransportMode.CAR
			);
			chai.expect(modeDirectionThatShouldntBeThere).to.be.undefined('Expect undefined');
		});
	});
});
