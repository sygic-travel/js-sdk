import { dummyFunction } from './Places/Controller';
import { SdkBase } from './SdkBase';

export default class SdkPublic extends SdkBase {
	public dummyFunction() {
		return dummyFunction();
	}
}
