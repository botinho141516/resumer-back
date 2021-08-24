const http = require('http');


export const initServer = () => {
  console.log('Server running at http://127.0.0.1:8125/');
  const server = http.createServer().listen(8125);


  return server;
}