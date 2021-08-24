import { Browser, PuppeteerNode } from 'puppeteer';
import { DefaultReturn } from '../..';
const puppeteer = require('puppeteer');


export const initPuppeteer = () => {
  const startPuppeteer = async (): Promise<DefaultReturn<Browser>> => {
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

  const endPuppeteer = async (browser: Browser): Promise<DefaultReturn<boolean>> => {
    try {
      await browser.close();

      return {
        result: true,
      };

    } catch (err) {
      return {
        error: err.message,
      };
    }
  }

  return {
    startPuppeteer,
    endPuppeteer,
  }
}

