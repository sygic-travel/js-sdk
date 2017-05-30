export function addDayToDate(date: string): string {
	const d = new Date(date);
	d.setDate(d.getDate() + 1);
	return formatDate(d);
}

export function subtractDayToDate(date: string): string {
	const d = new Date(date);
	d.setDate(d.getDate() - 1);
	return formatDate(d);
}

function formatDate(inputDate: Date): string {
	const day: string = ('0' + inputDate.getDate()).slice(-2);
	const month: string = ('0' + (inputDate.getMonth() + 1)).slice(-2);
	const year: string = inputDate.getFullYear().toString();
	return [year, month, day].join('-');
}
