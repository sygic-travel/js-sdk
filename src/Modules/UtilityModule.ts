import { getExchangeRates } from '../ExchangeRates';
import { Location, locationToMapTileKey } from '../Geo';

/**
 * @experimental
 */
export default class UtilityModule {
	public locationToMapTileKey(location: Location, zoom: number): string {
		return locationToMapTileKey(location, zoom);
	}

	public getExchangeRates = getExchangeRates;
}
