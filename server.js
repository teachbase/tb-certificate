const express = require('express');
const http = require('http');

const app = express();
const server = http.Server(app);

const path = require('path');

app.use(express.static(path.join(__dirname, '/build')));

app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

server.listen(8080);
