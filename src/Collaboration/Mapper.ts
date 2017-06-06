import { camelizeKeys } from 'humps';
import { Collaboration } from './Collaboration';

export const mapTripCollaborationsApiResponseToCollaborations = (collaborations: any): Collaboration[] => {
	return collaborations.map((collaboration): Collaboration => camelizeKeys(collaboration) as Collaboration);
};
