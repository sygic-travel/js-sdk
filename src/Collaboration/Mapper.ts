import { Collaboration } from './Collaboration';

export const mapTripCollaborationsApiResponseToCollaborations = (collaborations: any): Collaboration[] => {
	return collaborations.map((collaboration): Collaboration => {
		return {
			id: collaboration.id,
			userName: collaboration.user_name,
			userEmail: collaboration.user_email,
			userPhotoUrl: collaboration.user_photo_url,
			accepted: collaboration.accepted,
			accessLevel: collaboration.access_level,
			createdAt: collaboration.created_at,
			updatedAt: collaboration.updated_at,
			tripId: collaboration.trip_guid
		} as Collaboration;
	});
};
