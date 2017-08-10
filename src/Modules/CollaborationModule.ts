import {
	acceptTripCollaboration,
	addTripCollaboration,
	Collaboration,
	followTrip,
	getTripCollaborations,
	removeTripCollaboration,
	resendInvitation,
	unfollowTrip,
	updateTripCollaboration
} from '../Collaboration';

/**
 * @experimental
 */
export default class CollaborationModule {
	public followTrip(tripId: string): Promise<void> {
		return followTrip(tripId);
	}

	public unfollowTrip(tripId: string): Promise<void> {
		return unfollowTrip(tripId);
	}

	public addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void> {
		return addTripCollaboration(tripId, userEmail, accessLevel);
	}

	public getTripCollaborations(tripId: string): Promise<Collaboration[]> {
		return getTripCollaborations(tripId);
	}

	public removeTripCollaboration(collaborationId: string): Promise<void> {
		return removeTripCollaboration(collaborationId);
	}

	public acceptTripCollaboration(collaborationId: string, hash: string): Promise<string> {
		return acceptTripCollaboration(collaborationId, hash);
	}

	public resendInvitation(collaborationId: string): Promise<void> {
		return resendInvitation(collaborationId);
	}

	public updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void> {
		return updateTripCollaboration(collaborationId, accessLevel);
	}
}
