import http from 'http';
import { initControllers } from './controllers/controllers';
const path = require('path');
const fs = require('fs/promises');

interface IRoutes {
  server: http.Server;
  controllers: ReturnType<typeof initControllers>;

}

const INDEX_FILE = path.join(__dirname, 'views', 'index.html');

export const initRoutes = ({ server, controllers }: IRoutes) => {
  server.on('request', async (req, res) => {

    const getBody = () => new Promise<Record<string, string>>((resolve, reject) => {
      if (req.method === 'POST') {
        const body = [];

        req.on('data', (chunk) => {
          body.push(chunk);
        }).on('end', () => {
          resolve(JSON.parse(`${Buffer.concat(body)}`));
        }).on('error', reject);
      }
    })

    if (req.method === 'POST') {
      switch (req.url) {
        case '/request/resume': {
          if (req.headers['content-type'] === 'application/json') {
            const { text } = await getBody();

            const textResumed = await controllers.resumeText(text);
            console.log({ textResumed })
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ textResumed }));
            res.end();
          }
          break;
        }

        default:
          res.writeHead(500);
          res.end();

          break;
      }

    }
    else if (req.method === 'GET') {
      switch (req.url) {
        default:
          const indexPage = await fs.readFile(INDEX_FILE, { encoding: 'utf8' })
          res.writeHead(200);
          res.write(indexPage);
          res.end();

          break;
      }

    }


  });
}