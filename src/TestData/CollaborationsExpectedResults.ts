import { Collaboration } from '../Collaboration/';

export const collaborations = [{
		id: 123,
		userName: 'John Doe',
		userEmail: 'mail@example.com',
		userPhotoUrl: 'https://placekitten.com/100/100',
		accepted: true,
		accessLevel: 'read-write',
		createdAt: '2015-01-01',
		updatedAt: '2015-01-01',
	}, {
		id: 981,
		userName: 'John Moe',
		userEmail: 'mail@example.com',
		userPhotoUrl: 'https://placekitten.com/100/100',
		accepted: true,
		accessLevel: 'read-only',
		createdAt: '2015-01-01',
		updatedAt: '2015-01-01',
	}
] as Collaboration[];
