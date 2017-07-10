export interface PlaceReview {
	id: number;
	userId: string;
	userName: string;
	itemGuid: string;
	message: string | null;
	rating: number | null;
	votesUp: number;
	votesDown: number;
	votesScore: number;
	currentUserVote: number;
	createdAt: string;
	updatedAt: string | null;
}
