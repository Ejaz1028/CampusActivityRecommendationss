const amqp = require('amqplib');

let channel;
let connection;

const RETRY_INTERVAL = 5000; // 5 seconds

async function connectRabbitMQ() {
    try {
        console.log('🔄 Attempting to connect to RabbitMQ...');
        const amqp = require('amqplib');

        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest',
            frameMax: 8192   // 🔴 REQUIRED FIX
        });

        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');

        // Create an exchange for Pub/Sub
        await channel.assertExchange('event_exchange', 'fanout', { durable: true });

        connection.on('error', (err) => {
            console.error('❌ RabbitMQ connection error:', err);
            channel = null;
            connection = null;
            setTimeout(connectRabbitMQ, RETRY_INTERVAL);
        });

        connection.on('close', () => {
            console.warn('⚠️ RabbitMQ connection closed. Reconnecting...');
            channel = null;
            connection = null;
            setTimeout(connectRabbitMQ, RETRY_INTERVAL);
        });

        return channel;
    } catch (error) {
        console.error('❌ Failed to connect to RabbitMQ:', error.message);
        // console.error(error); // Uncomment for full stack trace if needed
        console.log(`⏳ Retrying in ${RETRY_INTERVAL / 1000}s...`);
        setTimeout(connectRabbitMQ, RETRY_INTERVAL);
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