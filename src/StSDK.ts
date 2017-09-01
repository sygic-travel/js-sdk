import { BaseSDK } from './BaseSDK';

import ChangesModule from './Modules/ChangesModule';
import CollaborationModule from './Modules/CollaborationModule';
import CollectionsModule from './Modules/CollectionsModule';
import CustomPlacesModule from './Modules/CustomPlacesModule';
import FavoritesModule from './Modules/FavoritesModule';
import ForecastModule from './Modules/ForecastModule';
import HotelsModule from './Modules/HotelsModule';
import PlacesModule from './Modules/PlacesModule';
import RoutesModule from './Modules/RoutesModule';
import SearchModule from './Modules/SearchModule';
import ToursModule from './Modules/ToursModule';
import TripModule from './Modules/TripModule';
import UserModule from './Modules/UserModule';
import UtilityModule from './Modules/UtilityModule';

export default class StSDK extends BaseSDK {
	public changes: ChangesModule = new ChangesModule();
	public collaboration: CollaborationModule = new CollaborationModule();
	public collections: CollectionsModule = new CollectionsModule();
	public customPlaces: CustomPlacesModule = new CustomPlacesModule();
	public favorites: FavoritesModule = new FavoritesModule();
	public forecast: ForecastModule = new ForecastModule();
	public places: PlacesModule = new PlacesModule();
	public hotels: HotelsModule = new HotelsModule();
	public routes: RoutesModule = new RoutesModule();
	public search: SearchModule = new SearchModule();
	public tours: ToursModule = new ToursModule();
	public trip: TripModule = new TripModule();
	public user: UserModule = new UserModule();
	public utility: UtilityModule = new UtilityModule();
}
