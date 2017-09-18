import * as chai from 'chai';
import * as cloneDeep from 'lodash.clonedeep';

import { CategoriesCoefficients, SpreadSizeConfig } from '.';
import { Bounds } from '../Geo';
import { Place } from '../Places';
import { CanvasSize } from '../Spread';
import { spread } from './Spreader';

const bounds: Bounds = {
	south: 0,
	west: 0,
	north: 1,
	east: 1
};
const canvas: CanvasSize = {
	width: 50,
	height: 50
};
const place: Place = {
	id: 'poi:1',
	level: 'poi',
	rating: 10,
	quadkey: '0123',
	location: {lat: 0.1, lng: 0.1},
	boundingBox: null,
	name: 'Poi1',
	nameSuffix: '',
	url: '',
	marker: 'resataurant',
	categories: [],
	parents: [],
	perex: '',
	thumbnailUrl: 'http://example.com',
	starRating: null,
	starRatingUnofficial: null,
	customerRating: null,
	detail: null
};
const sizeConfigs: SpreadSizeConfig[] = [
	{
		radius: 5,
		margin: 5,
		name: 'big',
		photoRequired: true,
		zoomLevelLimits: [0],
		disabledCategories: []
	},
	{
		radius: 2,
		margin: 2,
		name: 'small',
		photoRequired: true,
		zoomLevelLimits: [0],
		disabledCategories: []
	}
];

const categoriesCoefficients: CategoriesCoefficients = {
	noCategory: 0.3,
	discovering: 0.8,
	eating: 0.6,
	goingOut: 0.6,
	hiking: 0.5,
	playing: 0.5,
	relaxing: 0.6,
	shopping: 0.5,
	sightseeing: 1,
	sleeping: 0.2,
	doingSports: 0.4,
	traveling: 0.1,
};

describe('Spreader', () => {
	describe('#spread', () => {
		it('should spread one place correctly', () => {
			// Place out of canvas
			const place2 = Object.assign({}, place);
			place2.location = {lat: -0.3, lng: 10.3};
			const spreaded = spread([place, place2], [], sizeConfigs, bounds, canvas, categoriesCoefficients);
			chai.expect(spreaded.hidden.length).to.equal(0);
			chai.expect(spreaded.visible.length).to.equal(2);
			chai.expect(spreaded.visible[0].size.name).to.equal('big');
		});
	});

	it('should hide place without photo correctly', () => {
		const placeWithoutImage = Object.assign({}, place);
		placeWithoutImage.thumbnailUrl = null;
		const spreaded = spread([placeWithoutImage], [], [sizeConfigs[0]], bounds, canvas, null);
		chai.expect(spreaded.hidden.length).to.equal(1);
		chai.expect(spreaded.visible.length).to.equal(0);
	});

	it('should hide place with low rating by minimal zoom rating', () => {
		const config = cloneDeep(sizeConfigs[0]);
		config.zoomLevelLimits = [1];
		const lowRatingPlace = cloneDeep(place);
		lowRatingPlace.rating = 0.01;
		const spreaded = spread([lowRatingPlace], [], [config], bounds, canvas, null);
		chai.expect(spreaded.hidden.length).to.equal(1);
		chai.expect(spreaded.visible.length).to.equal(0);
	});

	it('should hide place which collides with another place', () => {
		const spreaded = spread([place, place], [], [sizeConfigs[0]], bounds, canvas, null);
		chai.expect(spreaded.hidden.length).to.equal(1);
		chai.expect(spreaded.visible.length).to.equal(1);
	});

	it('should use smaller size when bigger size collides', () => {
		const place2 = Object.assign({}, place);
		place2.location = {lat: 0.3, lng: 0.3};
		place2.id = 'poi:2';
		const spreaded = spread([place, place2], [], sizeConfigs, bounds, canvas, null);
		chai.expect(spreaded.hidden.length).to.equal(0);
		chai.expect(spreaded.visible.length).to.equal(2);
		chai.expect(spreaded.visible[0].size.name).to.equal('big');
		chai.expect(spreaded.visible[1].size.name).to.equal('small');
	});

	it('should hide place with low rated category', () => {
		const config = cloneDeep(sizeConfigs[0]);
		config.zoomLevelLimits = [0.5];
		const lowRatingPlace = cloneDeep(place);
		lowRatingPlace.rating = 0.6;
		lowRatingPlace.categories = ['traveling'];
		const spreaded = spread([lowRatingPlace], [], [config], bounds, canvas, categoriesCoefficients);
		chai.expect(spreaded.hidden.length).to.equal(1);
		chai.expect(spreaded.visible.length).to.equal(0);
	});

	it('should not hide VIP place by even with low rated category', () => {
		const config = cloneDeep(sizeConfigs[0]);
		config.zoomLevelLimits = [0.5];
		const lowRatingPlace = cloneDeep(place);
		lowRatingPlace.rating = 0.6;
		lowRatingPlace.categories = ['traveling'];
		const spreaded = spread([], [lowRatingPlace], [config], bounds, canvas, categoriesCoefficients);
		chai.expect(spreaded.hidden.length).to.equal(0);
		chai.expect(spreaded.visible.length).to.equal(1);
	});

	it('should use smaller size when bigger is restricted by rating', () => {
		const config = cloneDeep(sizeConfigs[0]);
		config.zoomLevelLimits = [0.5];
		const place1 = cloneDeep(place);
		place1.rating = 0.6;
		place1.categories = ['traveling'];
		const place2 = Object.assign({}, place);
		place2.location = {lat: 0.3, lng: 0.3};
		place2.id = 'poi:2';
		const spreaded = spread([place1, place2], [], [config, sizeConfigs[1]], bounds, canvas, categoriesCoefficients);
		chai.expect(spreaded.hidden.length).to.equal(0);
		chai.expect(spreaded.visible.length).to.equal(2);
		chai.expect(spreaded.visible[0].size.name).to.equal('small');
		chai.expect(spreaded.visible[1].size.name).to.equal('big');
	});
});
