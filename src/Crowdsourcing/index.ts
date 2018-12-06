import isUrl from 'is-url-superb';

import { Location } from '../Geo';
import { getDetailedPlace, getPlaceAttributes, PlaceAttributes, Reference } from '../Places';
import { DetailedPlace } from '../Places/Place';
import * as Dao from './DataAccess';
import { UpdatableReferenceType } from './Event';

const imageSize = '100x100';

export const createPlace = Dao.createPlace;

export const updatePlaceAddress = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceAddress(placeId, place.detail.address, suggested, note);
};

export const updatePlaceAdmission = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceAdmission(placeId, place.detail.admission, suggested, note);
};

export const updatePlaceEmail = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceEmail(placeId, place.detail.email, suggested, note);
};

export const updatePlaceLocation = async (
	placeId: string,
	suggested: Location,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceLocation(placeId, place.location, suggested, note);
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

export const updatePlaceOpeningHours = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceOpeningHours(placeId,  place.detail.openingHoursRaw, suggested, note);
};

export const updatePlaceOpeningHoursNote = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlaceOpeningHoursNote(placeId,  place.detail.openingHours, suggested, note);
};

export const updatePlacePhone = async (
	placeId: string,
	suggested: string,
	note: string | null
): Promise<string> => {
	const place: DetailedPlace = await getDetailedPlace(placeId, imageSize);
	return Dao.updatePlacePhone(placeId,  place.detail.phone, suggested, note);
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

export const createPlaceTag = Dao.createPlaceTag;
export const deletePlaceTag = Dao.deletePlaceTag;
export const createPlaceMedia = Dao.createPlaceMedia;
export const getEvents = Dao.getEvents;
export const moderateEvents = Dao.moderateEvents;
export const assignNextEvents = Dao.assignNextEvents;
