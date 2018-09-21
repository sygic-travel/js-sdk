import * as Crowdsourcing from '../Crowdsourcing';

/**
 * @experimental
 */
export default class CrowdsourcingModule {
	public createPlace = Crowdsourcing.createPlace;
	public updatePlaceAddress = Crowdsourcing.updatePlaceAddress;
	public updatePlaceAdmission = Crowdsourcing.updatePlaceAdmission;
	public updatePlaceEmail = Crowdsourcing.updatePlaceEmail;
	public updatePlaceLocation = Crowdsourcing.updatePlaceLocation;
	public updatePlaceName = Crowdsourcing.updatePlaceName;
	public updatePlaceOpeningHours = Crowdsourcing.updatePlaceOpeningHours;
	public updatePlaceOpeningHoursNote = Crowdsourcing.updatePlaceOpeningHoursNote;
	public updatePlacePhone = Crowdsourcing.updatePlacePhone;
	public createPlaceTag = Crowdsourcing.createPlaceTag;
	public deletePlaceTag = Crowdsourcing.deletePlaceTag;
	public createPlaceMedia = Crowdsourcing.createPlaceMedia;
	public createPlaceReference = Crowdsourcing.createPlaceReference;
	public updatePlaceReference = Crowdsourcing.updatePlaceReference;
}
