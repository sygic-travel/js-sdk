import { PlaceReview } from './PlaceReview';

export interface PlaceReviewsData {
	rating: number;
	currentUserHasReview: boolean;
	reviews: PlaceReview[];
}
