const amqp = require('amqplib');

let channel;
let connection;

const RETRY_INTERVAL = 5000; // 5 seconds

async function connectRabbitMQ() {
    try {
        console.log('🔄 Attempting to connect to RabbitMQ...');
        connection = await amqp.connect({
            protocol: 'amqp',
            hostname: '127.0.0.1',
            port: 5672,
            username: 'guest',
            password: 'guest',
            frameMax: 8192
        });

        channel = await connection.createChannel();
        console.log('✅ Connected to RabbitMQ');

        // Create an exchange for Pub/Sub (Topic for targeted messaging)
        await channel.assertExchange('campus_event_exchange', 'topic', { durable: true });

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

// Helper to publish a message for a specific event
async function publishToEvent(eventId, message) {
    const ch = await getChannel();
    if (!ch) return;
    const routingKey = `events.${eventId}`;
    ch.publish('campus_event_exchange', routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`[x] Sent message for event ${eventId}: ${JSON.stringify(message)}`);
}

// Helper to subscribe to messages for a specific event
async function subscribeToEvent(eventId, callback) {
    const ch = await getChannel();
    if (!ch) return;
    const q = await ch.assertQueue('', { exclusive: true });
    const routingKey = `events.${eventId}`;
    await ch.bindQueue(q.queue, 'campus_event_exchange', routingKey);
    ch.consume(q.queue, (msg) => {
        if (msg.content) {
            callback(JSON.parse(msg.content.toString()));
        }
    }, { noAck: true });
    console.log(`[*] Subscribed to messages for event ${eventId}`);
}

// Helper to publish a message for a specific publisher (any event by them)
async function publishToPublisher(publisherId, message) {
    const ch = await getChannel();
    if (!ch) return;
    const routingKey = `publishers.${publisherId}`;
    ch.publish('campus_event_exchange', routingKey, Buffer.from(JSON.stringify(message)));
    console.log(`[x] Sent message for publisher ${publisherId}: ${JSON.stringify(message)}`);
}

// Helper to subscribe to messages from a specific publisher
async function subscribeToPublisher(publisherId, callback) {
    const ch = await getChannel();
    if (!ch) return;
    const q = await ch.assertQueue('', { exclusive: true });
    const routingKey = `publishers.${publisherId}`;
    await ch.bindQueue(q.queue, 'campus_event_exchange', routingKey);
    ch.consume(q.queue, (msg) => {
        if (msg.content) {
            callback(JSON.parse(msg.content.toString()));
        }
    }, { noAck: true });
    console.log(`[*] Subscribed to messages from publisher ${publisherId}`);
}

// Initialize RabbitMQ on startup
connectRabbitMQ();

module.exports = {
    getChannel,
    publishToEvent,
    subscribeToEvent,
    publishToPublisher,
    subscribeToPublisher
};