import { ICache } from './ICache';
import { InMemoryCache } from './InMemoryCache';

export const placesDetailedCache: ICache = new InMemoryCache();
export const tripsDetailedCache: ICache = new InMemoryCache();
export const routesCache: ICache = new InMemoryCache();
export const userCache: ICache = new InMemoryCache();
export const favoritesCache: ICache = new InMemoryCache();
