import { Browser, Page, Puppeteer, PuppeteerNode } from 'puppeteer';
import { DefaultReturn } from '..';
const puppeteer = require('puppeteer');


export const startPuppeteer = async (): Promise<DefaultReturn<Browser>> => {
  const browser = await (puppeteer as PuppeteerNode).launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: false,
  });

  if (!browser) {
    return {
      error: 'Browser not found'
    }
  }


  return {
    result: browser
  };
}

export const goToResoomer = async (browser: Browser): Promise<DefaultReturn<Page>> => {
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

export const getResume = async (page: Page, content: string): Promise<DefaultReturn<string>> => {
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


    await page.waitForSelector('#contentTexteResoomer_3');

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