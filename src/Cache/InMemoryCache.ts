import { ICache } from './ICache';

export class InMemoryCache implements ICache {
	private cache = {};

	public async set(key: string, value: any): Promise<void> {
		this.cache[key] = value !== null && typeof value === 'object' ? Object.assign({}, value) : value;
	}

	public async get(key: string): Promise<any> {
		const value = this.cache[key];
		if (!value) {
			return null;
		}
		return typeof value === 'object' ? Object.assign({}, value) : value;
	}

	public async getBatch(keys: string[]): Promise<any[]> {
		return keys.map((key: string) => this.get(key));
	}

	public async remove(key: string): Promise<void> {
		delete this.cache[key];
	}

	public async reset(): Promise<void> {
		this.cache = {};
	}
}
