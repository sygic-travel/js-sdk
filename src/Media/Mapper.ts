import { MainMedia, Media } from './Media';

const defaultPhotoSize = '300x300';

export function mapMainMediaToMedia(mainMedia: MainMedia, photoSize: string): Media {
	const mappedMedia = {};
	Object.keys(mainMedia.usage).forEach((key) => {
		const mediaGuid = mainMedia.usage[key];
		mappedMedia[key] = mainMedia.media.reduce((acc, item) => {
			if (item.guid === mediaGuid) {
				item.urlTemplate = item.urlTemplate.replace(/{size}/i, photoSize || defaultPhotoSize);
				return item;
			}
			return acc;
		}, null);
	});

	return mappedMedia as Media;
}
