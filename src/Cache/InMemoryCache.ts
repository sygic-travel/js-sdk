import { ICache } from './ICache';

export class InMemoryCache implements ICache {
	private cache = {};

	public async set(key: string, value: any): Promise<void> {
		this.cache[key] = value !== null && typeof value === 'object' ? deepClone(value) : value;
	}

	public async get(key: string): Promise<any> {
		const value = this.cache[key];
		if (!value) {
			return null;
		}
		return typeof value === 'object' ? deepClone(value) : value;
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
		delete this.cache[key];
	}

	public async reset(): Promise<void> {
		this.cache = {};
	}
}

function deepClone(value: any): any {
	return JSON.parse(JSON.stringify(value));
}
