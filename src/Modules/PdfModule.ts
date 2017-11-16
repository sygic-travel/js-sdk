import { getPdfData} from '../Pdf';
import { PdfData, PdfQuery } from '../Pdf/PdfData';

/**
 * @experimental
 */
export default class PdfModule {
	public async getPdfData(query: PdfQuery): Promise<PdfData> {
		return getPdfData(query);
	}
}
