import { Bounds } from '../Geo';
import { Severity, Type } from './Alert';

export interface AlertsQuery {
	from: string;
	to: string;
	types?: Type[];
	severities?: Severity[];
	placeIds?: string[];
	limit?: number;
	bounds?: Bounds;
}
