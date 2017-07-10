import { Tour } from './Tour';

export function mapToursApiResponseToTours(tours: any): Tour[] {
	return tours.map((tour: any) => {
		return {
			id: tour.id,
			supplier: tour.supplier,
			title: tour.title,
			perex: tour.perex,
			url: tour.url,
			rating: tour.rating,
			reviewCount: tour.review_count,
			photoUrl: tour.photo_url,
			price: tour.price,
			originalPrice: tour.original_price,
			duration: tour.duration
		} as Tour;
	});
}
