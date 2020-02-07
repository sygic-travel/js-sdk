import isUrl from 'is-url-superb';

import { Location } from '../Geo';
import { getDetailedPlace, getPlaceAttributes, PlaceAttributes, Reference } from '../Places';
import { DetailedPlace } from '../Places/Place';
import * as Dao from './DataAccess';
import { UpdatableReferenceType } from './Event';

const imageSize = '100x100';

export const createPlace = Dao.createPlace;
export const deletePlace = Dao.deletePlace;

export const updatePlaceAddress = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceAddress(placeId, place.detail.address, suggested, note);
};

export const deletePlaceAddress = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.address) {
		throw new Error('Place doesn\'t have address');
	}
	return Dao.deletePlaceAddress(placeId, place.detail.address, note);
};

export const updatePlaceAdmission = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceAdmission(placeId, place.detail.admission, suggested, note);
};

export const deletePlaceAdmission = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.admission) {
		throw new Error('Place doesn\'t have admission');
	}
	return Dao.deletePlaceAdmission(placeId, place.detail.admission, note);
};

export const updatePlaceEmail = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceEmail(placeId, place.detail.email, suggested, note);
};

export const deletePlaceEmail = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.email) {
		throw new Error('Place doesn\'t have email');
	}
	return Dao.deletePlaceEmail(placeId, place.detail.email, note);
};

export const updatePlaceLocation = async (
	placeId: string,
	suggested: Location,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceLocation(placeId, place.location, suggested, note);
};

export const createPlaceName = async (
	placeId: string,
	languageId: string | null,
	suggested: string,
	note: string | null
): Promise<string> => {
	return Dao.updatePlaceName(
		placeId,
		languageId,
		null,
		suggested,
		note
	);
};

export const updatePlaceName = async (
	placeId: string,
	languageId: string | null,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceName(
		placeId,
		languageId,
		languageId ? place.name : place.originalName,
		suggested,
		note
	);
};

export const deletePlaceName = async (
	placeId: string,
	languageId: string | null,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	let name: string = '';
	if (languageId) {
		if (!place.name) {
			throw new Error('Place doesn\'t have name');
		}
		name = place.name;
	} else {
		if (!place.originalName) {
			throw new Error('Place doesn\'t have name');
		}
		name = place.originalName;
	}
	return Dao.deletePlaceName(
		placeId,
		languageId,
		name,
		note
	);
};

export const updatePlaceOpeningHours = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceOpeningHours(placeId,  place.detail.openingHoursRaw, suggested, note);
};

export const deletePlaceOpeningHours = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.openingHoursRaw) {
		throw new Error('Place doesn\'t have opening hours');
	}
	return Dao.deletePlaceOpeningHours(placeId,  place.detail.openingHoursRaw, note);
};

export const updatePlaceOpeningHoursNote = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceOpeningHoursNote(placeId,  place.detail.openingHoursNote, suggested, note);
};

export const deletePlaceOpeningHoursNote = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.openingHoursNote) {
		throw new Error('Place doesn\'t have opening hours');
	}
	return Dao.deletePlaceOpeningHoursNote(placeId,  place.detail.openingHoursNote, note);
};

export const updatePlacePhone = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlacePhone(placeId,  place.detail.phone, suggested, note);
};

export const deletePlacePhone = async (
	placeId: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	if (!place.detail.phone) {
		throw new Error('Place doesn\'t have phone');
	}
	return Dao.deletePlacePhone(placeId,  place.detail.phone, note);
};

export const createPlaceReference = async (
	placeId: string,
	languageId: string | null,
	suggestedType: string,
	suggestedUrl: string,
	note: string | null
): Promise<string> => {
	if (!Object.keys(UpdatableReferenceType).includes(suggestedType)) {
		throw new Error('Can\'t update this reference type');
	}

	if (!isUrl(suggestedUrl)) {
		throw new Error('Suggested URL is not valid');
	}

	return Dao.createPlaceReference(placeId, languageId, suggestedType, suggestedUrl, note);
};

export const updatePlaceReference = async (
	placeId: string,
	languageId: string | null,
	referenceId: number,
	suggestedUrl: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	const referenceToBeUpdated: Reference | undefined = place.detail.references.find((reference: Reference) => (
		reference.id === referenceId
	));

	if (!referenceToBeUpdated) {
		throw new Error('Reference not found');
	}

	if (!Object.keys(UpdatableReferenceType).includes(referenceToBeUpdated.type)) {
		throw new Error('Can\'t update suggested reference type');
	}

	if (!isUrl(suggestedUrl)) {
		throw new Error('Suggested URL is not valid');
	}

	return Dao.updatePlaceReference(
		placeId,
		languageId,
		referenceToBeUpdated.url,
		referenceToBeUpdated.type,
		suggestedUrl,
		note
	);
};

export const deletePlaceReference = async (
	placeId: string,
	languageId: string | null,
	referenceId: number,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	const referenceToBeDeleted: Reference | undefined = place.detail.references.find((reference: Reference) => (
		reference.id === referenceId
	));

	if (!referenceToBeDeleted) {
		throw new Error('Reference not found');
	}

	if (!Object.keys(UpdatableReferenceType).includes(referenceToBeDeleted.type)) {
		throw new Error('Can\'t delete suggested reference type');
	}

	return Dao.deletePlaceReference(
		placeId,
		languageId,
		referenceToBeDeleted.url,
		referenceToBeDeleted.type,
		note
	);
};

export const createPlaceAttribute = async (
	placeId: string,
	languageId: string | null,
	suggestedKey: string,
	suggestedValue: string,
	note: string | null
): Promise<string> => {
	return Dao.createPlaceAttribute(placeId, languageId, suggestedKey, suggestedValue, note);
};

export const updatePlaceAttribute = async (
	placeId: string,
	languageId: string | null,
	originalValue: string,
	suggestedKey: string,
	suggestedValue: string,
	note: string | null
): Promise<string> => {
	const placeAttributes: PlaceAttributes = await getPlaceAttributes(placeId);

	if (!placeAttributes.attributes || !placeAttributes.attributes[suggestedKey]) {
		throw new Error('Attribute not found');
	}

	return Dao.updatePlaceAttribute(
		placeId,
		languageId,
		originalValue,
		suggestedKey,
		suggestedValue,
		note
	);
};

export const deletePlaceAttribute = async (
	placeId: string,
	languageId: string | null,
	attributeKey: string,
	note: string | null
): Promise<string> => {
	const placeAttributes: PlaceAttributes = await getPlaceAttributes(placeId);

	if (!placeAttributes.attributes || !placeAttributes.attributes[attributeKey]) {
		throw new Error('Attribute not found');
	}

	return Dao.deletePlaceAttribute(
		placeId,
		languageId,
		placeAttributes.attributes[attributeKey],
		attributeKey,
		note
	);
};

export const createPlaceTag = Dao.createPlaceTag;
export const deletePlaceTag = Dao.deletePlaceTag;
export const createPlaceMedia = Dao.createPlaceMedia;
export const getEvents = Dao.getEvents;
export const moderateEvents = Dao.moderateEvents;
export const assignNextEvents = Dao.assignNextEvents;
