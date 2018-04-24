import { Alert, DetailedAlert } from './Alert';

export const mapAlertApiResponseToAlert = (alert: any): Alert => ({
	id: alert.id,
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
} as Alert);

export const mapAlertsApiResponseToAlerts = (alerts: any[]): Alert[] => alerts.map(mapAlertApiResponseToAlert);

export const mapDetailedAlertApiResponseToDetailedAlert = (detailedAlert: any): DetailedAlert => {
	const mappedAlert: Alert = mapAlertApiResponseToAlert(detailedAlert);
	return {
		...mappedAlert,
		description: detailedAlert.description,
		externalId: detailedAlert.external_id,
		webUrl: detailedAlert.web_url,
		geometry: detailedAlert.geometry
	} as DetailedAlert;
};
