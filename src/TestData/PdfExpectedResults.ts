import { GeneratingState } from '../Pdf/PdfData';

export const pdfGeneratingResult: GeneratingState = {
	generatingId: '5a214f38613262_en',
	state: 'generating',
	url: null
};
export const pdfDoneResult: GeneratingState = {
	generatingId: '5a214f38613262_en',
	state: 'done',
	url: 'http://example.coom/pdf.pdf'
};
export const pdfNotFoundResult: GeneratingState = {
	generatingId: '5a214f38613262_en',
	state: 'not_found',
	url: null
};
