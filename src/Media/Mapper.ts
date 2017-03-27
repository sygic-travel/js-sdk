import { MainMedia, Media } from './Media';
export function mapMainMediaToMedia(mainMedia: MainMedia): Media {
	const mappedMedia = {};

	Object.keys(mainMedia.usage).forEach((key) => {
		const mediaGuid = mainMedia.usage[key];
		mappedMedia[key] = mainMedia.media.reduce((acc, item) => item.guid === mediaGuid ? item : acc, null);
	});

	return mappedMedia as Media;
}
