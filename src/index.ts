import { readPdf } from "./pdf/pdf";
import { getResume, goToResoomer, startPuppeteer } from "./puppeteer/puppeteer";

export interface DefaultReturn<T> {
  error?: string;
  result?: T;
}



const main = async () => {
  const { error: startPuppeteerError, result: browser } = await startPuppeteer();

  if (startPuppeteerError) {
    throw new Error(startPuppeteerError);
  }

  const { error: readPdfError, result: pdfContent } = readPdf();

  if (readPdfError) {
    throw new Error(readPdfError);
  }

  const { error: goToResoomerError, result: page } = await goToResoomer(browser);


  if (goToResoomerError) {
    throw new Error(goToResoomerError);
  }

  const resume = await getResume(page, pdfContent);

  console.log(resume)


}


try {
  main();
} catch (err) {
  console.log(err);
}