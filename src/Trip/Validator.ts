import { isTransportAvoid, isTransportMode, isTransportType } from '.';

export function validateTransportSettings(settings): void {

	if (!isTransportMode(settings.mode)) {
		throw new Error('Invalid transport mode ' + settings.mode);
	}

	if (!isTransportType(settings.type)) {
		throw new Error('Invalid transport type ' + settings.type);
	}

	if (!settings.hasOwnProperty('avoid') && !(settings.avoid instanceof Array)) {
		throw new Error('avoid must be an array');
	}

	settings.avoid.forEach((avoid) => {
		if (!isTransportAvoid(avoid)) {
			throw new Error('Invalid avoid value ' + avoid);
		}
	});

	if (!settings.hasOwnProperty('startTime')) {
		throw new Error('Missing startTime');
	}

	if (settings.startTime !== null && settings.startTime > 24 * 3600 || settings.startTime < 0) {
		throw new Error('Invalid startTime value ' + settings.startTime);
	}

	if (!settings.hasOwnProperty('duration')) {
		throw new Error('Missing duration');
	}

	if (settings.duration !== null && settings.duration < 0) {
		throw new Error('Invalid duration value ' + settings.duration);
	}

	if (!settings.hasOwnProperty('note')) {
		throw new Error('Missing note');
	}

	if (settings.note !== null && typeof settings.note !== 'string') {
		throw new Error('Invalid note value ' + settings.note);
	}

	if (!settings.hasOwnProperty('waypoints') && !(settings.waypoints instanceof Array)) {
		throw new Error('waypoints must be an array');
	}

	settings.waypoints.forEach((wp) => {
		if (
			!wp.hasOwnProperty('lat') ||
			!wp.hasOwnProperty('lng') ||
			!(!isNaN(parseFloat(wp.lat)) && isFinite(wp.lat)) ||
			!(!isNaN(parseFloat(wp.lng)) && isFinite(wp.lng))
		) {
			throw new Error('Invalid waypoint value ' + wp.toString());
		}
	});
}
