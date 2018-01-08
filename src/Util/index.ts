export function addDaysToDate(date: string, count: number): string {
	const d = new Date(date);
	d.setDate(d.getDate() + count);
	return formatDate(d);
}

export function sleep(ms: number): Promise<void> {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export function subtractDaysFromDate(date: string, count: number): string {
	const d = new Date(date);
	d.setDate(d.getDate() - count);
	return formatDate(d);
}

/** Utility function to create a K:V from a list of strings */
export function listToEnum<T extends string>(o: T[]): {[K in T]: K} {
	return o.reduce((res, key) => {
		res[key] = key;
		return res;
	}, Object.create(null));
}

function formatDate(inputDate: Date): string {
	const day: string = ('0' + inputDate.getDate()).slice(-2);
	const month: string = ('0' + (inputDate.getMonth() + 1)).slice(-2);
	const year: string = inputDate.getFullYear().toString();
	return [year, month, day].join('-');
}

/**
 * See {@link https://gist.github.com/tristanlins/6585391}
 */
export function dateToW3CString(date: Date): string {
	const year: string = date.getFullYear().toString();
	let month: string = (date.getMonth() + 1).toString();
	if (date.getMonth() + 1 < 10) {
		month = '0' + month;
	}
	let day = date.getDate().toString();
	if (date.getDate() < 10) {
		day = '0' + day;
	}
	let hours = date.getHours().toString();
	if (date.getHours() < 10) {
		hours = '0' + hours;
	}
	let minutes = date.getMinutes().toString();
	if (date.getMinutes() < 10) {
		minutes = '0' + minutes;
	}
	let seconds = date.getSeconds().toString();
	if (date.getSeconds() < 10) {
		seconds = '0' + seconds;
	}
	const offset = -date.getTimezoneOffset();
	const offsetHoursValue = Math.abs(Math.floor(offset / 60));

	let offsetHours = offsetHoursValue.toString();
	let offsetMinutes = (Math.abs(offset) - offsetHoursValue * 60).toString();
	if (Math.abs(Math.floor(offset / 60)) < 10) {
		offsetHours = '0' + offsetHours.toString();
	}
	if (Math.abs(offset) - offsetHoursValue * 60 < 10) {
		offsetMinutes = '0' + offsetMinutes;
	}
	let offsetSign = '+';
	if (offset < 0) {
		offsetSign = '-';
	}
	return year + '-' + month + '-' + day +
		'T' + hours + ':' + minutes + ':' + seconds +
		offsetSign + offsetHours + ':' + offsetMinutes;
}

export function toRadians(degrees: number): number {
	return degrees * Math.PI / 180;
}

export function toDegrees(radians: number): number {
	return radians * 180 / Math.PI;
}

export function splitArrayToChunks<T>(arrayToBeSplit: T[], chunkSize: number): T[][] {
	const chunks: T[][] = [];
	const chunksCount: number = arrayToBeSplit.length / chunkSize;
	let j = 0;

	for (let i = 0; i < chunksCount; i++) {
		chunks[i] = arrayToBeSplit.slice(j, j + chunkSize);
		j += chunkSize;
	}
	return chunks;
}
