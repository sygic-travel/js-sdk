export interface Collaboration {
	id: number;
	userName: string | null;
	userEmail: string;
	userPhotoUrl: string | null;
	accepted: boolean;
	accessLevel: string;
	createdAt: string;
	updatedAt: string | null;
	tripId: string;
}
