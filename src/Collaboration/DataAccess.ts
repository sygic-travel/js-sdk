import { ApiResponse, StApi } from '../Api';
import { Collaboration } from './Collaboration';
import { mapTripCollaborationsApiResponseToCollaborations } from './Mapper';

export async function followTrip(tripId: string): Promise<void> {
	await StApi.post(`trip/${tripId}/subscription`, null);
}

export async function unfollowTrip(tripId: string): Promise<void> {
	await StApi.delete_(`trip/${tripId}/subscription`, null);
}

export async function getTripCollaborations(tripId: string): Promise<Collaboration[]> {
	const apiResponse: ApiResponse = await StApi.get(`trip/${tripId}/collaborations`);
	if (!apiResponse.data.hasOwnProperty('collaborations')) {
		throw new Error('Wrong API response');
	}
	return mapTripCollaborationsApiResponseToCollaborations(apiResponse.data.collaborations);
}

export async function addTripCollaboration(tripId: string, userEmail: string, accessLevel: string): Promise<void> {
	await StApi.post(`trip-collaborations`, {
		trip_guid: tripId,
		user_email: userEmail,
		access_level: accessLevel
	});
}

export async function removeTripCollaboration(collaborationId: string): Promise<void> {
	await StApi.delete_(`/trip-collaborations/${collaborationId}`, null);
}

export async function updateTripCollaboration(collaborationId: string, accessLevel: string): Promise<void> {
	await StApi.put(`/trip-collaborations/${collaborationId}`, {
		access_level: accessLevel
	});
}

export async function acceptTripCollaboration(collaborationId: string, hash: string): Promise<string> {
	const apiResponse: ApiResponse = await StApi.put(`/trip-collaborations/${collaborationId}/accept`, { hash });

	if (!apiResponse.data.hasOwnProperty('collaboration')) {
		throw new Error('Wrong API response');
	}

	return apiResponse.data.collaboration.trip_guid as string;
}

export async function resendInvitation(collaborationId: string): Promise<void> {
	await StApi.post(`/trip-collaborations/${collaborationId}/resend-email`, null);
}
