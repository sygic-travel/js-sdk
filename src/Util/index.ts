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

function formatDate(inputDate: Date): string {
	const day: string = ('0' + inputDate.getDate()).slice(-2);
	const month: string = ('0' + (inputDate.getMonth() + 1)).slice(-2);
	const year: string = inputDate.getFullYear().toString();
	return [year, month, day].join('-');
}
