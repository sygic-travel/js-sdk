import * as Cookies from 'cookies-js';
import { ICache } from './ICache';

const EXPIRATION: number = Infinity;

export class BrowserCookieCache implements ICache {

	public async set(key: string, value: any): Promise<void> {
		Cookies.set(key, JSON.stringify({value}), {expires: EXPIRATION});
	}

	public async get(key: string): Promise<any> {
		const dataString = Cookies.get(key);
		if (!dataString) {
			return null;
		}
		const data = JSON.parse(dataString);
		return data.value;
	}

	public async getAll(): Promise<any[]> {
		throw new Error('getAll() not available for cookie cache');
	}

	public getBatch(keys: string[]): Promise<any[]> {
		return Promise.all(keys.map((key: string) => this.get(key)));
	}

	public async getBatchMap(keys: string[]): Promise<Map<string, any>> {
		const data: any[] = await this.getBatch(keys);
		return data.reduce(
			(map: Map<string, any>, value: any, index: number) => (map.set(keys[index], value)),
			new Map<string, any>());
	}

	public async remove(key: string): Promise<void> {
		Cookies.remove(key);
	}

	public async reset(): Promise<void> {
		throw new Error('reset() not available for cookie cache');
	}
}
