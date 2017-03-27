import { camelizeKeys } from 'humps';

export function fromUnderscoreToCamelCase(input: object): object {
	return camelizeKeys(input);
}
