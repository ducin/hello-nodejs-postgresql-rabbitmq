const amqplib = require('amqplib');
const express = require('express');
const path = require('path');
const { setupTracing } = require('./tracing');

const tracer = setupTracing();
const app = express();
const PORT = 3000;
let messages = [];

const user = `myuser`;
const pswd = `mypassword`;

async function connect() {
    const connection = await amqplib.connect(`amqp://${user}:${pswd}@rabbitmq`);
    channel = await connection.createChannel();
    await channel.assertQueue('task_queue', { durable: true });

    channel.consume('task_queue', (msg) => {
        if (msg !== null) {
            tracer.startActiveSpan('consume_message', {
                attributes: {
                    'messaging.system': 'rabbitmq',
                    'messaging.destination': 'task_queue',
                    'messaging.correlation_id': msg.properties.headers.correlationId,
                    'messaging.message_id': msg.properties.messageId,
                }
            }, (parentSpan) => {
                tracer.startActiveSpan('parse_message', {
                    attributes: {
                        'messaging.message_payload_size_bytes': msg.content.length
                    }
                }, (parseSpan) => {
                    const content = msg.content.toString();
                    parseSpan.end();

                    tracer.startActiveSpan('store_message', (storeSpan) => {
                        messages.push(content);
                        console.log(`Received: ${content}`);
                        storeSpan.end();

                        tracer.startActiveSpan('acknowledge_message', (ackSpan) => {
                            channel.ack(msg);
                            ackSpan.end();
                            parentSpan.end();
                        });
                    });
                });
            });
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
