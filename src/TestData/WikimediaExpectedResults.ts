import { WikimediaResult } from '../Wikimedia';

export const wikimedia = {
	id: 'File:id.jpg',
	createdAt: '2014-03-09T20:27:21+0000',
	location: {
		lat: 12.34,
		lng: 43.21
	},
	original: {
		url: 'https://upload.wikimedia.org/image.jpg',
		width: 720,
		height: 480,
		size: 20224
	},
	thumbnail: {
		url: 'https://upload.wikimedia.org/thumb/image.jpg',
		width: 300,
		height: 200,
		size: null
	},
	attribution: {
		title: 'Nice title',
		titleUrl: 'https://commons.wikimedia.org/title.jpg',
		author: 'Authoe name',
		authorUrl: null,
		license: 'Public domain',
		licenseUrl: null,
		other: null
	}
} as WikimediaResult;
