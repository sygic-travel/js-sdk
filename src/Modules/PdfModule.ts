import { generatePdf, GeneratingState, getPdfData, PdfData, PdfQuery } from '../Pdf';

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
