const amqp = require('amqplib');

async function testConnection() {
    console.log("Testing RabbitMQ Connection...");
    try {
        const conn = await amqp.connect('amqp://guest:guest@127.0.0.1:5672');
        console.log("SUCCESS: Connected!");
        await conn.close();
    } catch (err) {
        console.error("FAILURE: Could not connect.");
        console.error(err);
    }
}

testConnection();
