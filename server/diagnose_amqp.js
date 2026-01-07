const amqp = require('amqplib');

async function testConnection() {
    const hosts = ['127.0.0.1', 'localhost', '::1'];
    for (const host of hosts) {
        console.log(`Testing RabbitMQ Connection to ${host}...`);
        try {
            const conn = await amqp.connect(`amqp://guest:guest@${host}:5672`, { frameMax: 0 }); // 0 means no limit, should negotiate correctly
            console.log(`SUCCESS: Connected to ${host}!`);
            await conn.close();
            return;
        } catch (err) {
            console.error(`FAILURE: Could not connect to ${host}.`);
            console.error(err.message);
        }
    }
}

testConnection();
