import { BaseSDK } from './BaseSDK';
import { initialize as initializeEventHandling } from './Events';
import AlertsModule from './Modules/AlertsModule';
import ChangesModule from './Modules/ChangesModule';
import CollaborationModule from './Modules/CollaborationModule';
import CollectionsModule from './Modules/CollectionsModule';
import CustomPlacesModule from './Modules/CustomPlacesModule';
import EventsModule from './Modules/EventsModule';
import FavoritesModule from './Modules/FavoritesModule';
import FlightsModule from './Modules/FlightsModule';
import ForecastModule from './Modules/ForecastModule';
import HotelsModule from './Modules/HotelsModule';
import MediaModule from './Modules/MediaModule';
import PdfModule from './Modules/PdfModule';
import PlacesModule from './Modules/PlacesModule';
import RoutesModule from './Modules/RoutesModule';
import SearchModule from './Modules/SearchModule';
import SessionModule from './Modules/SessionModule';
import ToursModule from './Modules/ToursModule';
import TripModule from './Modules/TripModule';
import UtilityModule from './Modules/UtilityModule';
import WikimediaModule from './Modules/WikimediaModule';
import { Settings } from './Settings';

class StSDK extends BaseSDK {
	public alerts: AlertsModule = new AlertsModule();
	public changes: ChangesModule = new ChangesModule();
	public collaboration: CollaborationModule = new CollaborationModule();
	public collections: CollectionsModule = new CollectionsModule();
	public customPlaces: CustomPlacesModule = new CustomPlacesModule();
	public events: EventsModule = new EventsModule();
	public favorites: FavoritesModule = new FavoritesModule();
	public flights: FlightsModule = new FlightsModule();
	public forecast: ForecastModule = new ForecastModule();
	public hotels: HotelsModule = new HotelsModule();
	public media: MediaModule = new MediaModule();
	public pdf: PdfModule = new PdfModule();
	public places: PlacesModule = new PlacesModule();
	public routes: RoutesModule = new RoutesModule();
	public search: SearchModule = new SearchModule();
	public session: SessionModule = new SessionModule();
	public tours: ToursModule = new ToursModule();
	public trip: TripModule = new TripModule();
	public utility: UtilityModule = new UtilityModule();
	public wikimedia: WikimediaModule = new WikimediaModule();
}

export function create(settings: Settings): StSDK {
	const stSDK: StSDK = new StSDK(settings);
	initializeEventHandling();
	return stSDK;
}
