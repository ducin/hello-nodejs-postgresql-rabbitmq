const express = require('express');
const amqplib = require('amqplib');
const path = require('path');

const app = express();
const PORT = 3000;
let channel;

app.use(express.static(path.join(__dirname)));

const user = `myuser`
const pswd = `mypassword`

async function connect() {
    const connection = await amqplib.connect(`amqp://${user}:${pswd}@rabbitmq`);
    channel = await connection.createChannel();
    await channel.assertQueue('task_queue', { durable: true });
}

app.post('/send', async (req, res) => {
    const msg = 'Hello from Producer';
    channel.sendToQueue('task_queue', Buffer.from(msg), { persistent: true });
    res.send({ message: 'Message sent' });
});

app.listen(PORT, () => {
    connect();
    console.log(`Producer running on port ${PORT}`);
});
