import { getAlerts, getDetailedAlerts } from '../Alerts';

/**
 * @experimental
 */
export default class AlertsModule {
	public getAlerts = getAlerts;
	public getDetailedAlerts = getDetailedAlerts;
}
