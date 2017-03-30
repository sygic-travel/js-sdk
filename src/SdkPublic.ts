import { dummyFunction } from './Places';
import { SdkBase } from './SdkBase';

export default class SdkPublic extends SdkBase {
	public dummyFunction() {
		return dummyFunction();
	}
}
