import { getExchangeRates } from '../ExchangeRates';
import { Location, locationToMapTileKey } from '../Geo';
import { getStApiUrl, setStApiUrl } from '../Settings';

/**
 * @experimental
 */
export default class UtilityModule {
	public locationToMapTileKey(location: Location, zoom: number): string {
		return locationToMapTileKey(location, zoom);
	}

	public getExchangeRates = getExchangeRates;
	public getStApiUrl = getStApiUrl;
	public setStApiUrl = setStApiUrl;

}
