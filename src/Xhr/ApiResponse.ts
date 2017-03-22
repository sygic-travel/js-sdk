export class ApiResponse {
	private _status: string;
	private _statusCode: number;
	private _statusMessage: string;
	private _data: any;

	constructor(status: string, statusCode: number, statusMessage: string, data: Object) {
		this._status = status;
		this._statusCode = statusCode;
		this._statusMessage = statusMessage;
		this._data = data;
	}

	get status(): string {
		return this._status;
	}

	set status(value: string) {
		this._status = value;
	}

	get statusCode(): number {
		return this._statusCode;
	}

	set statusCode(value: number) {
		this._statusCode = value;
	}

	get statusMessage(): string {
		return this._statusMessage;
	}

	set statusMessage(value: string) {
		this._statusMessage = value;
	}

	get data(): any {
		return this._data;
	}

	set data(value: any) {
		this._data = value;
	}
}
