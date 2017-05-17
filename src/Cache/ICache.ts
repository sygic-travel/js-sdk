export interface ICache {
	set(key: string, value: any): void;
	get(key: string): any;
	getBatch(keys: string[]): any[];
	remove(key: string): any;
	reset(): void;
}
