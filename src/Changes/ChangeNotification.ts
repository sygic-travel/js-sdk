export interface ChangeNotification {
	id: string | null;
	type: 'trip' | 'favorite' | 'settings';
	change: 'updated' | 'deleted';
	version: number | null;
}
