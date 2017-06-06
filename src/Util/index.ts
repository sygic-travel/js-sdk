export function addDaysToDate(date: string, count: number): string {
	const d = new Date(date);
	d.setDate(d.getDate() + count);
	return formatDate(d);
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
