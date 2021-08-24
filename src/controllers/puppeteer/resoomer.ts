import { Browser, ElementHandle, Page } from 'puppeteer';
import { DefaultReturn } from '../..';


export const initResoomerPuppeteer = () => {
  const goToResoomer = async (browser: Browser): Promise<DefaultReturn<Page>> => {
    try {
      const page = await browser.newPage();

      await page.goto('https://resoomer.com/en/', { timeout: 15000 });

      await page.waitForSelector('#contentText');

      return {
        result: page
      };
    } catch (err) {
      return {
        error: err.message,
      };
    }
  }

  const getResume = async (page: Page, content: string): Promise<DefaultReturn<string>> => {
    try {

      // paste the content
      await page.evaluate((content) => {
        const resumeInput: HTMLInputElement = document.querySelector('#contentText');

        resumeInput.value = content;
      }, content);


      // click the button
      await page.evaluate(() => {
        const resumeButton: HTMLElement = document.querySelector('#btnSendText_V2');

        resumeButton.click();
      });


      const elementFound = await Promise.race([
        page.waitForSelector('#contentTexteResoomer_3')
          .then((selector) => Promise.resolve({ value: selector, status: 'done' })),

        page.waitForSelector('#conteneurTexteResumer')
          .then((selector) => Promise.resolve({ value: selector, status: 'alreadyResumed' })),
      ]);

      if (elementFound.status === 'alreadyResumed') {
        return {
          result: content,
        };
      }

      const resumedContent: string = await page.evaluate(() => {
        const outputElement: HTMLElement = document.querySelector('#contentTexteResoomer_3');
        const resumedContent = outputElement.innerText;

        return resumedContent;
      });

      return {
        result: resumedContent,
      };


    } catch (err) {
      return {
        error: err.message,
      };
    }
  }

  return {
    goToResoomer,
    getResume,
  }
}

