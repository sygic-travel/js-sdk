import { generatePdf, getPdfData } from '../Pdf';
import { GeneratingState, PdfData, PdfQuery } from '../Pdf/PdfData';

/**
 * @experimental
 */
export default class PdfModule {
	public async getPdfData(query: PdfQuery): Promise<PdfData> {
		return getPdfData(query);
	}

	public async generatePdf(tripId: string): Promise<GeneratingState> {
		return generatePdf(tripId);
	}
}
