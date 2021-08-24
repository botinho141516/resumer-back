import { initPuppeteer } from "./puppeteer/puppeteer";
import { initResoomerPuppeteer } from "./puppeteer/resoomer";

export interface IControllers {
  puppeteer: ReturnType<typeof initPuppeteer>;
  resoomer: ReturnType<typeof initResoomerPuppeteer>;
}


export const initControllers = ({ puppeteer, resoomer }: IControllers) => {

  const resumeText = async (text: string) => {
    try {

      const { error: startPuppeteerError, result: browser } = await puppeteer.startPuppeteer();

      if (startPuppeteerError) {
        throw new Error(startPuppeteerError);
      }


      const { error: goToResoomerError, result: page } = await resoomer.goToResoomer(browser);


      if (goToResoomerError) {
        throw new Error(goToResoomerError);
      }

      const { error: getResumeError, result: resume } = await resoomer.getResume(page, text);

      if (getResumeError) {
        throw new Error(getResumeError);
      }

      await puppeteer.endPuppeteer(browser);
      return resume;
    } catch (err) {
      console.log(err);
    }

  }

  return {
    ...puppeteer,
    ...resoomer,
    resumeText,
  }
}