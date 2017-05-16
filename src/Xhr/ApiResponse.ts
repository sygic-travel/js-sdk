export class ApiResponse {
	private _statusCode: number;
	private _data: any;

	constructor(statusCode: number, data: object) {
		this._statusCode = statusCode;
		this._data = data;
	}

	get statusCode(): number {
		return this._statusCode;
	}

	set statusCode(value: number) {
		this._statusCode = value;
	}

	get data(): any {
		return this._data;
	}

	set data(value: any) {
		this._data = value;
	}
}
