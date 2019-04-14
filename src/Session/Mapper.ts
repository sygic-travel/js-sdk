import { UserInfo, UserLicense } from '.';
import { PrivacyConsents } from './User';

export const mapUserInfo = (userData: any) => {
	const license: UserLicense | null = userData.premium ? {
		name: userData.premium.name,
		type: userData.premium.type,
		productId: userData.premium.product_id,
		expirationAt: userData.premium.expiration_at,
		isActive: userData.premium.is_active,
	} : null;

	const privacyConsents: PrivacyConsents[] = userData.privacy_consents.map((privacyConsent: any) => ({
		type: privacyConsent.type,
		agreed: privacyConsent.agreed,
		answeredAt: privacyConsent.answered_at
	}));

	return {
		id: userData.id,
		name: userData.name,
		email: userData.email,
		isEmailSubscribed: userData.is_email_subscribed,
		isRegistered: userData.is_registered,
		photoUrl: userData.photo ? userData.photo.url : null,
		dateCreated: userData.created_date,
		roles: userData.roles,
		license,
		privacyConsents
	} as UserInfo;
};
