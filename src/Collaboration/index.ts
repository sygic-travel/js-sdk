import { Collaboration } from './Collaboration';
import * as Dao from './DataAccess';

export { Collaboration };

export async function followTrip(tripId: string): Promise<void> {
	return Dao.followTrip(tripId);
}

export async function unfollowTrip(tripId: string): Promise<void> {
	return Dao.unfollowTrip(tripId);
}

export async function getTripCollaborations(tripId: string): Promise<Collaboration[]> {
	return Dao.getTripCollaborations(tripId);
}

export async function addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void> {
	return Dao.addTripCollaboration(tripId, userEmail, accessLevel);
}

export async function removeTripCollaboration(collaborationId: string): Promise<void> {
	return Dao.removeTripCollaboration(collaborationId);
}

export async function acceptTripCollaboration(collaborationId: string, hash: string): Promise<string> {
	return Dao.acceptTripCollaboration(collaborationId, hash);
}

export async function resendInvitation(collaborationId: string): Promise<void> {
	return Dao.resendInvitation(collaborationId);
}

export async function updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void> {
	return Dao.updateTripCollaboration(collaborationId, accessLevel);
}
