const amqplib = require('amqplib');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
let messages = [];

async function connect() {
    const connection = await amqplib.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    await channel.assertQueue('task_queue', { durable: true });

    channel.consume('task_queue', (msg) => {
        if (msg !== null) {
            messages.push(msg.content.toString());
            console.log(`Received: ${msg.content.toString()}`);
            channel.ack(msg);
        }
    });
}

app.get('/messages', (req, res) => {
    res.send(messages);
});

app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    connect();
    console.log(`Consumer running on port ${PORT}`);
});
