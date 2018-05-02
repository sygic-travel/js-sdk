import { Bounds } from '../Geo';
import { Severity, State, Type } from './Alert';

export interface AlertsQuery {
	from: string;
	to: string;
	types?: Type[];
	severities?: Severity[];
	states?: State[];
	placeIds?: string[];
	limit?: number;
	bounds?: Bounds;
}
