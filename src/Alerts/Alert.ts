export interface Alert {
	id: number;
	perex: string;
	type: Type;
	severity: Severity;
	affectedArea: GeoJSON.DirectGeometryObject;
	name: string;
	state: State;
	validFrom: string;
	validTo: string;
	origin: string;
	provider: string;
	providerUrl: string;
	updatedAt: string;
}

export enum Type {
	AIR_POLUTION = 'air_polution',
	AVALANCHE = 'avalanche',
	BLIZZARD = 'blizzard',
	COASTAL_HAZARDS = 'coastal_hazards',
	COLD_FRONT = 'cold_front',
	EARTHQUAKE = 'earthquake',
	FLOOD = 'flood',
	FOG = 'fog',
	FREEZE = 'freeze',
	ICING = 'icing',
	RAIN = 'rain',
	SNOW = 'snow',
	STORM = 'storm',
	SEVERE_WEATHER = 'severe_weather',
	TORNADO = 'tornado',
	VOLCANO = 'volcano',
	UNKNOWN = 'unknown',
	WIND = 'wind',
}

export enum Severity {
	MINOR = 'minor',
	MODERATE = 'moderate',
	SEVERE = 'severe',
	EXTREME = 'extreme',
	UNKNOWN = 'unknown',
}

export enum State {
	ACTIVE = 'active',
	INSUFFICIENT_DATA = 'insufficient data',
	CANCELED = 'canceled',
	OUTDATED = 'outdated'
}

export interface DetailedAlert extends Alert {
	description: string | null;
	webUrl: string | null;
	externalId: string;
	geometry: GeoJSON.DirectGeometryObject | null;
}
