const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('New client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

module.exports = wss;