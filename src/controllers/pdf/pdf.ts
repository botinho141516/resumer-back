import { DefaultReturn } from "../.."
import { PDFExtract, PDFExtractOptions, PDFExtractResult } from 'pdf.js-extract'
import { existsSync } from "fs"
import { join } from "path"


export const initPdfReader = () => {
  const getPdf = async (pdfName: string): Promise<DefaultReturn<string>> => {
    const fullPath = join(__dirname, '..', 'assets', 'pdfs', pdfName);

    const pdfExists = existsSync(fullPath)
    if (pdfExists) {
      return {
        result: fullPath,
      }
    }
    return {
      error: 'Pdf not found',
    }

  }

  const formatPdf = (rawContent: PDFExtractResult): string => {
    const resultsFiltered = rawContent.pages.map((item) => (
      item.content.filter((content) => {
        const filterCondition = (
          content.fontName === "g_d0_f2"
          && content.str.length > 10
          && content.height === 10
        );

        return filterCondition
      })
    ));

    const a = resultsFiltered.flat(1);
    const pdfText = a.map(({ str }) => str);

    const pdfContent = pdfText.join(' ');

    return pdfContent;
  }

  const readPdf = async (path: string): Promise<DefaultReturn<string>> => {
    const extractor = new PDFExtract();
    const extractionOptions: PDFExtractOptions = {};

    const extractResult = await extractor.extract(path, extractionOptions);

    const pdfContent = formatPdf(extractResult);

    return {
      result: pdfContent,
    }
  }

  return {
    getPdf,
    readPdf,
    formatPdf,
  };
}