import { Alert } from './Alert';

export const mapAlertsApiResponseToAlerts = (alerts: any[]): Alert[] => alerts.map((alert: any) => ({
	id: alert.id,
	externalId: alert.external_id,
	type: alert.type,
	severity: alert.severity,
	affectedArea: alert.affected_area as GeoJSON.GeoJsonObject,
	perex: alert.perex,
	name: alert.name,
	state: alert.state,
	origin: alert.origin,
	provider: alert.provider,
	providerUrl: alert.provider_url,
	validFrom: alert.valid_from,
	validTo: alert.valid_to,
	updatedAt: alert.updated_at
} as Alert));
