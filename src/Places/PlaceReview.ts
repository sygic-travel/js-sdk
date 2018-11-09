export interface PlaceReview {
	id: number;
	userId: string;
	userName: string;
	placeId: string;
	message: string | null;
	rating: number | null;
	votesUp: number;
	votesDown: number;
	votesScore: number;
	currentUserVote: number;
	createdAt: string;
	updatedAt: string | null;
}

export interface PlaceReviewsData {
	rating: number;
	currentUserHasReview: boolean;
	reviews: PlaceReview[];
}

export interface PlaceReviewFromYelp {
	id: string;
	url: string;
	text: string;
	rating: number;
	createdAt: string;
	user: PlaceReviewFromYelpUser;
}

export interface PlaceReviewFromYelpUser {
	id: string;
	profileUrl: string;
	imageUrl: string;
	name: string;
}

export interface PlaceReviewsFromYelpData {
	rating: number;
	totalCount: number;
	reviews: PlaceReviewFromYelp[];
}
