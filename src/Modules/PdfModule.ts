import { generatePdf, GeneratingState, getLongPdfData, getShortPdfData, PdfData, PdfQuery } from '../Pdf';

/**
 * @experimental
 */
export default class PdfModule {
	public async getShortPdfData(tripId: string): Promise<PdfData> {
		return getShortPdfData(tripId);
	}

	public async getLongPdfData(query: PdfQuery): Promise<PdfData> {
		return getLongPdfData(query);
	}

	public async generatePdf(tripId: string): Promise<GeneratingState> {
		return generatePdf(tripId);
	}
}
