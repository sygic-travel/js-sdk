export interface ICache {
	set(key: string, value: any): Promise<void>;
	get(key: string): Promise<any>;
	getAll(): Promise<any[]>
	getBatch(keys: string[]): Promise<any[]>;
	getBatchMap(keys: string[]): Promise<Map<string, any>>;
	remove(key: string): Promise<any>;
	reset(): Promise<void>;
}
