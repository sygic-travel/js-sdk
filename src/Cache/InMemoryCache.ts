import { ICache } from './ICache';

export class InMemoryCache implements ICache {
	private cache = {};

	public set(key: string, value: any): void {
		this.cache[key] = value;
	}

	public get(key: string): any {
		return this.cache[key];
	}

	public getBatch(keys: string[]): any[] {
		return keys.map((key: string) => {
			return this.cache[key];
		});
	}

	public remove(key: string): void {
		delete this.cache[key];
	}

	public reset(): void {
		this.cache = {};
	}
}
