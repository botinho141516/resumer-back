import { initControllers } from "./controllers/controllers";
import { initPuppeteer } from "./controllers/puppeteer/puppeteer";
import { initResoomerPuppeteer } from "./controllers/puppeteer/resoomer";
import { initRoutes } from "./routes";
import { initServer } from "./server";

export interface DefaultReturn<T> {
  error?: string;
  result?: T;
}

const puppeteer = initPuppeteer();
const resoomer = initResoomerPuppeteer();
const controllers = initControllers({ puppeteer, resoomer });

const server = initServer();

try {
  initRoutes({
    server,
    controllers,
  });
} catch (err) {
  console.log(err);
}