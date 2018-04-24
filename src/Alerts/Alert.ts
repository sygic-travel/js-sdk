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
	WIND = 'wind',
	TORNADO = 'tornado',
	RAIN = 'rain',
	FOG = 'fog',
	SNOW = 'snow',
	BLIZZARD = 'blizzard',
	FLOOD = 'flood',
	AVALANCHE = 'avalanche',
	STORM = 'storm',
	SEVERE_WEATHER = 'severe weather',
	EARTHQUAKE = 'earthquake',
	ICING = 'icing',
	COASTAL_HAZARDS = 'coastal hazards',
	UNKNOWN = 'unknown'
}

export enum Severity {
	MINOR = 'minor',
	MODERATE = 'moderate',
	SEVERE = 'severe',
	EXTREME = 'extreme'
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
