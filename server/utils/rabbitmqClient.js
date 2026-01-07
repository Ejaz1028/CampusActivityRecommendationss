const amqp = require('amqplib');

let channel;
let connection;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect('amqp://localhost');
        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');

        // Create an exchange for Pub/Sub
        await channel.assertExchange('event_exchange', 'fanout', { durable: true });

        return channel;
    } catch (error) {
        console.error('❌ RabbitMQ connection error: RabbitMQ is likely not running. Proceeding without message queue.');
        // Do NOT retry recursively without a delay or simply suppress. 
        // For now, return null so the app can continue.
        return null;
    }
}

// Ensure getChannel waits for channel to be ready
async function getChannel() {
    if (!channel) {
        console.warn("⚠️ RabbitMQ channel not initialized. Waiting...");
        await connectRabbitMQ(); // Try reconnecting
    }
    return channel;
}

// Initialize RabbitMQ on startup
connectRabbitMQ();

module.exports = { getChannel };