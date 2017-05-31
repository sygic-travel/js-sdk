

# Sygic Travel SDK for Javascript · [![CircleCI](https://circleci.com/gh/sygic-travel/js-sdk/tree/master.svg?style=shield&circle-token=ade273efccfc9edfabdc76b77acf8746ac45e94d)](https://circleci.com/gh/sygic-travel/js-sdk/tree/master) [![GitHub release](https://img.shields.io/github/release/sygic-travel/js-sdk.svg)](https://github.com/sygic-travel/js-sdk)

A set of client-side functions for accessing and processing data provided by Sygic Travel APIs.

## Introduction

The Sygic Travel SDK for JavaScript provides a set of client-side functionality which:
- Enables you to get and filter a list of places
- Enables you to get a detailed place information with references (links and related products)
- Enables you to get media (photos and videos) for a place
- Spreads places on a map according to your configuration

You can also check out our [API Documentation](http://docs.sygictravelapi.com/js-sdk/master/).

## Installation
You can get the UMD build from the CDN, which you can include to your document,
```html
<script src=“cdn.travel.sygic.com/js-sdk/v0.2.0/SygicTravelSDK.js”></script>
```
or install it using Yarn or NPM (Typescript types included).
```
yarn add sygic-travel/js-sdk.git#v0.2.0
```
## Initialization
#### [`create`](http://docs.sygictravelapi.com/js-sdk/master/modules/_sdk_.html#create)
Creates an instance of [Sygic Travel SDK](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html)
##### Arguments:
- `apiUrl: string`
- `clientKey: string`
##### Returns:
- [`StSDK`](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html)
```
import * as SygicTravelSDK from ‘sygic-travel-js-sdk’;
const apiUrl: string = ‘https://api.sygictravelapi.com/0.1/en/';
const clientKey: ‘CLIENT_KEY’; // Get your client key at https://travel.sygic.com/b2b/api-key
const stSDK: SygicTravelSDK.StSDK = SygicTravelSDK.create(apiUrl, clientKey);
```

## Instance methods
### [`getPlaces`](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html#getplaces)
Fetches a list of places according to the applied filter.

##### Arguments:
- [`filter: Places.PlacesFilterJSON`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_places_filter_.placesfilterjson.html)
##### Returns:
- [`Promise<Places.Place[]>`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_places_place_.place.html)

```ts
const placeFilter: SygicTravelSDK.Places.PlacesFilterJSON = {
    query: null, // text query, for example from a search input field
    mapTile: null,
    mapSpread: null,
    bounds: {
        south: 50.123,
        west: -0.55,
        north: 50.523,
        east: 0.05
    },
    categories: [‘eating’], // filter out only certain categories
    tags: [], // filter out only certain tags
    parent: ‘city:1’, // filter out only places that has certain parent
    level: null,
    limit: 20
};

stSDK.getPlaces(placeFilter).then((places: SygicTravelSDK.Places.Place[]) => {
    console.log(places);
});
```

---

### [`getPlaceDetailed`](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html#getplacedetailed)
Returns a single place with populated [`detail`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_places_place_.place.html#detail) property.
##### Arguments:
- `id: string`
- `photoSize: string`
##### Returns:
- [`Promise<Places.Place>`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_places_place_.place.html)

---

### [`getPlaceMedia`](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html#getplacemedia)
Fetches media for place.
#### Arguments:
- `id: string`
#### Returns:
- [`Promise<Media.Medium[]>`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_media_media_.medium.html)
---
### [`spreadPlacesOnMap`](http://docs.sygictravelapi.com/js-sdk/master/classes/_stsdk_.stsdk.html#spreadplacesonmap)
Will calculate positions of places (map markers) according to spread configuration.

#### Arguments:
- [`places: Places.Place[]`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_places_place_.place.html)
- [`bounds: Geo.Bounds`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_geo_bounds_.bounds.html)
- [`canvas: Spread.CanvasSize`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_spread_canvas_.canvassize.html)
- [`markerSizes (optional): Spread.SpreadSizeConfig[]`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_spread_config_.spreadsizeconfig.html)
#### Returns:
- [`Spread.SpreadResult`](http://docs.sygictravelapi.com/js-sdk/master/interfaces/_spread_spreader_.spreadresult.html)

```ts
const placeFilter: SygicTravelSDK.Places.PlacesFilterJSON = {
    query: null,
    mapTile: null,
    mapSpread: null,
    categories: [‘eating’],
    tags: [],
    parent: ‘city:1’,
    level: null
};

const bounds: SygicTravelSDK.Geo.Bounds = {
    south: 51.44705,
    west: -0.25817,
    north: 51.56736,
    east: 0.071411
}

// map canvas size
const canvasSize: SygicTravelSDK.Spread.CanvasSize = {
    width: 1024,
    height: 768
}

stSDK.getPlaces(placeFilter).then((places: SygicTravelSDK.Places.Place[]) => {
    return stSDK.spreadPlaces(places, bounds, canvasSize);
}).then((spreadPlaces: SygicTravelSDK.Spread.SpreadResult) => {
    console.log(spreadPlaces);
});
```
