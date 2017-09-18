

# Sygic Travel SDK for Javascript · [![CircleCI](https://circleci.com/gh/sygic-travel/js-sdk/tree/master.svg?style=shield&circle-token=ade273efccfc9edfabdc76b77acf8746ac45e94d)](https://circleci.com/gh/sygic-travel/js-sdk/tree/master) [![GitHub release](https://img.shields.io/github/release/sygic-travel/js-sdk.svg)](https://github.com/sygic-travel/js-sdk)

A set of client-side functions for accessing and processing data provided by Sygic Travel APIs.

## Introduction

The Sygic Travel SDK for JavaScript provides a set of client-side functionality which:
- Enables you to get and filter a list of places
- Enables you to get a detailed place information with references (links and related products)
- Enables you to get media (photos and videos) for a place
- Spreads places on a map according to your configuration

You can also check out our [Reference documentation](http://docs.sygictravelapi.com/js-sdk/v1.1.0/).

## Installation
You can get the UMD build from the CDN, which you can include to your document,
```html
<script src=“cdn.travel.sygic.com/js-sdk/v1.1.0/SygicTravelSDK.js”></script>
```
or install it using Yarn or NPM (Typescript types included).
```
yarn add sygic-travel/js-sdk.git#v1.1.0
```
## Initialization
#### [`create`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/modules/_sdk_.html#create)
Creates an instance of [Sygic Travel SDK](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_stsdk_.stsdk.html)
##### Arguments:
- `apiUrl: string`
- `clientKey: string`
##### Returns:
- [`StSDK`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_stsdk_.stsdk.html)
```
// const SygicTravelSDK = require('sygic-travel-js-sdk/index.node') for node
import * as SygicTravelSDK from 'sygic-travel-js-sdk';
const apiUrl: string = 'https://api.sygictravelapi.com/1.0/en/';
const clientKey: string = 'CLIENT_KEY'; // Get your client key at https://travel.sygic.com/b2b/api-key
const stSDK: SygicTravelSDK.StSDK = SygicTravelSDK.create(apiUrl, clientKey);
```

## Instance methods

### [`getPlaces`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_modules_placesmodule_.placesmodule.html#getplaces)
Fetches a list of places according to the applied filter.

##### Arguments:
- [`filter: Places.PlacesListFilterJSON`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_places_listfilter_.placeslistfilterjson.html)
PlacesListFilterJSON
###### PlacesFilter:

```ts
// Filter full example
const placeFilter: SygicTravelSDK.Places.PlacesListFilterJSON = {
    query: 'Tower',
    mapTiles: ['0121011'], // Matches places within map tile coordinate.  For details see [Bing Maps docs](https://msdn.microsoft.com/en-us/library/bb259689.aspx) or Maptiler.org
    mapSpread: 1,
    bounds: {
        south: 50.123,
        west: -0.55,
        north: 50.523,
        east: 0.05
    },
    categories: ['eating', 'sightseeing'], // filter out only certain categories
    categoriesOperator: 'OR',
    tags: ['indian_cousine', 'mexican_counsine'],
    tagsOperator: 'OR',
    parents: ['city:1', 'city:5'], // filter out only places that has certain parents
    parentsOperator: 'OR',
    levels: ['poi'],
    limit: 20,
    zoom: 10
}
```

| Property  | Description |
| ---------- | ----------- |
| query | Matches places containing the query within name, description ... |
| mapTiles | Matches places within map tile coordinate.  For details see [Bing Maps docs](https://msdn.microsoft.com/en-us/library/bb259689.aspx) or [Maptiler.org](Maptiler.org) |
| bounds | Limits results to area defined by bounds. The units are in degrees of latitude/longitude. |
| mapSpread | Use mapSpread when you want to display the places on the map. The area is subdivided into more areas so places cover map equally. Possible values are 0,1,2 or 3. This parameter requires bounds and zoom.|
| categories | Limits results by categories. It is possible to pass multiple categories. To get possible values check [Places section in API documentation](http://docs.sygictravelapi.com/1.0/).|
| categoriesOperator | 'AND' or 'OR' specifies which logic operator will be applied for multiple categories. The default value is AND.|
| tags | Limits results by tags. It is possible to pass multiple tags. To get possible values check [Places section in API documentation](http://docs.sygictravelapi.com/1.0/).|
| tagsOperator | 'AND' or 'OR' specifies which logic operator will be applied for multiple tags. The default value is AND.|
| parents | Limits results by ID of parent place. It is possible to pass multiple parents. |
| parentsOperator | 'AND' or 'OR' specifies which logic operator will be applied for multiple parents. The default value is AND.|
| levels | Limits results by levels. For multiple levels the AND operator applies. To get possible values check [Places section in API documentation](http://docs.sygictravelapi.com/1.0/). |
| limit | Limits the number of results. Default value is 10. Maximum value is 512. |
| zoom | Zoom level of map. This is required for mapSpread. |

##### Returns:
- [`Promise<Places.Place[]>`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_places_place_.place.html)

##### Usage example:
```ts
const placeFilter: SygicTravelSDK.Places.PlacesListFilterJSON = {
    query: null, // text query, for example from a search input field
    mapTiles: null,
    mapSpread: null,
    bounds: {
        south: 50.123,
        west: -0.55,
        north: 50.523,
        east: 0.05
    },
    categories: ['eating'], // filter out only certain categories
    tags: [], // filter out only certain tags
    parents: ['city:1'], // filter out only places that has certain parents
    levels: null,
    limit: 20
};

const places: SygicTravelSDK.Places.Place[] = await stSDK.places.getPlaces(placeFilter);
console.log(places)
```

---

### [`getPlaceDetailed`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_modules_placesmodule_.placesmodule.html#getplacedetailed)
Returns a single place with populated [`detail`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_places_place_.place.html#detail) property.
##### Arguments:
- `id: string`
- `photoSize: string`
##### Returns:
- [`Promise<Places.Place>`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_places_place_.place.html)

---

### [`getPlaceMedia`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_modules_placesmodule_.placesmodule.html#getplacemedia)
Fetches media for place.
#### Arguments:
- `id: string`
#### Returns:
- [`Promise<Media.Medium[]>`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_media_media_.medium.html)
---

### [`spreadPlacesOnMap`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/classes/_modules_placesmodule_.placesmodule.html#spreadplacesonmap)
Will calculate positions of places (map markers) according to spread configuration.

#### Arguments:
- [`places: Places.Place[]`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_places_place_.place.html)
- [`bounds: Geo.Bounds`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_geo_bounds_.bounds.html)
- [`canvas: Spread.CanvasSize`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_spread_canvas_.canvassize.html)
- [`markerSizes (optional): Spread.SpreadSizeConfig[]`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_spread_config_.spreadsizeconfig.html)
#### Returns:
- [`Spread.SpreadResult`](http://docs.sygictravelapi.com/js-sdk/v1.1.0/interfaces/_spread_spreader_.spreadresult.html)

#### Usage example:
```ts
const placeFilter: SygicTravelSDK.Places.PlacesListFilterJSON = {
    query: null,
    mapTiles: null,
    mapSpread: null,
    categories: ['eating'],
    tags: [],
    parents: ['city:1'],
    levels: ['poi']
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

const places: SygicTravelSDK.Places.Place[] = await stSDK.places.getPlaces(placeFilter);
const spreadPlaces: SygicTravelSDK.Spread.SpreadResult = await stSDK.places.spreadPlacesOnMap(places, bounds, canvasSize);
console.log(spreadPlaces);
```
