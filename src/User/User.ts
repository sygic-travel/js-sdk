import { listToEnum } from '../Util';

export interface UserSettings {
	homePlaceId: string|null;
	workPlaceId: string|null;
}

const thirdPartyAuthTypes = listToEnum([
	'facebook',
	'google'
]);
export function isThirdPartyAuthType(val: any): val is ThirdPartyAuthType {
	return typeof val === 'string' && thirdPartyAuthTypes[val] === val;
}
export type ThirdPartyAuthType = keyof typeof thirdPartyAuthTypes;
