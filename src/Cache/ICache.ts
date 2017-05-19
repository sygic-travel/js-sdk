export interface ICache {
	set(key: string, value: any): Promise<void>;
	get(key: string): Promise<any>;
	getBatch(keys: string[]): Promise<any[]>;
	remove(key: string): Promise<any>;
	reset(): Promise<void>;
}
