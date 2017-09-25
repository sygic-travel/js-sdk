export class ApiResponse {
	private _statusCode: number;
	private _data: any;
	private _serverTimestamp: string | null;

	constructor(statusCode: number, data: object, serverTimestamp?: string) {
		this._statusCode = statusCode;
		this._data = data;
		this._serverTimestamp = serverTimestamp || null;
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

	get serverTimestamp(): string | null {
		return this._serverTimestamp;
	}

	set serverTimestamp(value: string | null) {
		this._serverTimestamp = value;
	}
}
