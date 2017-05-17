import { ICache } from './ICache';
import { InMemoryCache } from './InMemoryCache';

export const placesDetailedCache: ICache = new InMemoryCache();
export const tripsDetailedCache: ICache = new InMemoryCache();
