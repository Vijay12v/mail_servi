// server.js content
require('dotenv').config();
const http = require('http');
const WebSocket = require('ws');
const app = require('./app');
const emailQueue = require('./queue/EmailQueue');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket for real-time updates
wss.on('connection', (ws) => {
  const listener = (data) => {
    ws.send(JSON.stringify({ type: 'emailEvent', data }));
  };
  emailQueue.on('sent', listener);
  
  ws.on('close', () => {
    emailQueue.off('sent', listener);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});