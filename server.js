const http = require('http');
const app = require('./index');

const server = http.createServer(app);

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});