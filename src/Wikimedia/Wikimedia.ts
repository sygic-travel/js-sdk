import { Location } from '../Geo';
import { Attribution } from '../Media';

export interface WikimediaResult {
	id: string;
	createdAt: string;
	location: Location | null;
	original: WikimediaPhoto;
	thumbnail: WikimediaPhoto;
	attribution: Attribution;
}

export interface WikimediaPhoto {
	url: string;
	width: number;
	height: number;
	size: number | null;
}
