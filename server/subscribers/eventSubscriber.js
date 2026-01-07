const { getChannel } = require('../utils/rabbitmqClient');
const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server (this is required by the WebSocket server)
const server = http.createServer();

// Create WebSocket server instance
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log("✅ New WebSocket connection established.");
    ws.on('message', (message) => {
        console.log("💬 Received message from client:", message);
    });
    ws.on('close', () => {
        console.log("❌ WebSocket connection closed.");
    });
});

// RabbitMQ subscriber setup
async function setupRabbitMQ() {
    try {
        const channel = await getChannel();
        if (!channel) {
            console.warn("⚠️ RabbitMQ channel is not available. Skipping subscriber setup.");
            return;
        }

        // Ensure the exchange exists
        await channel.assertExchange('event_exchange', 'fanout', { durable: true });

        // Create a named, durable queue and bind it to the exchange
        const queueName = 'event_notifications_queue';
        await channel.assertQueue(queueName, { durable: true });
        await channel.bindQueue(queueName, 'event_exchange', '');

        console.log("✅ RabbitMQ subscriber setup successful.");

        channel.consume(queueName, (message) => {
            if (message !== null) {
                const msgStr = message.content.toString();
                console.log("📩 Received message from RabbitMQ:", msgStr);
                channel.ack(message);
                // Broadcast message to all connected WebSocket clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(msgStr);
                    }
                });
            }
        });
    } catch (error) {
        console.error("❌ Error setting up RabbitMQ subscriber:", error);
    }
}

// Start the WebSocket server on a chosen port (e.g. 8080)
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 WebSocket server started on ws://localhost:${PORT}`);
});

// Call the setup function
setupRabbitMQ();