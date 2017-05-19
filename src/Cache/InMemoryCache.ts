import { ICache } from './ICache';

export class InMemoryCache implements ICache {
	private cache = {};

	public set(key: string, value: any): any {
		this.cache[key] = value;
		return value !== null && typeof value === 'object' ? Object.assign({}, value) : value;
	}

	public get(key: string): any {
		const value = this.cache[key];
		if (!value) {
			return null;
		}
		return typeof value === 'object' ? Object.assign({}, value) : value;
	}

	public getBatch(keys: string[]): any[] {
		return keys.map((key: string) => this.get(key));
	}

	public remove(key: string): void {
		delete this.cache[key];
	}

	public reset(): void {
		this.cache = {};
	}
}
